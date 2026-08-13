"""`_dflineage`'s DataFrame-chain shapes — `selectExpr`, `withColumns`, and
`.agg({...})` dict shorthand — three shapes that were unrecognised before and
degraded to no lineage at all. Not a general test of the module: just the
shapes this change adds coverage for.
"""

from __future__ import annotations

import sys
from pathlib import Path

# _dflineage imports _refs/_sqllineage/_views by bare name (it runs inside a
# scrubbed child process where the sandbox directory IS the import root), so
# the sandbox directory has to lead sys.path to import it here too.
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "sandbox"))
import _dflineage  # noqa: E402

CTX = {"default_workspace": "ws", "default_lakehouse": "lh"}
ORDERS = "ws/lh/orders"
SCHEMAS = {ORDERS: [{"name": "id"}, {"name": "amount"}, {"name": "region"}]}


def flows_to(reader: _dflineage._Reader, ref: str) -> dict[str, tuple[str, str]]:
    """`{to_column: (from_table, from_column)}` for one written table."""
    return {
        f["to_column"]: (f["from_table"], f["from_column"]) for f in reader.flows if f["to_table"] == ref
    }


def test_select_expr_bare_and_aliased_columns():
    out = "ws/lh/out"
    cells = [
        'df = spark.table("orders")\n'
        'out = df.selectExpr("id", "amount AS amt")\n'
        'out.write.saveAsTable("out")\n'
    ]
    reader = _dflineage.analyze_notebook(cells, SCHEMAS, CTX)
    flows = flows_to(reader, out)
    assert flows["id"] == (ORDERS, "id")
    assert flows["amt"] == (ORDERS, "amount")


def test_select_expr_drops_unparseable_expressions_not_the_whole_call():
    out = "ws/lh/out"
    cells = [
        'df = spark.table("orders")\n'
        'out = df.selectExpr("id", "amount * 2")\n'
        'out.write.saveAsTable("out")\n'
    ]
    reader = _dflineage.analyze_notebook(cells, SCHEMAS, CTX)
    flows = flows_to(reader, out)
    assert flows["id"] == (ORDERS, "id")
    assert "amount * 2" not in flows  # dropped, not guessed


def test_with_columns_plural_dict_form():
    out = "ws/lh/out"
    cells = [
        'df = spark.table("orders")\n'
        'out = df.withColumns({"amt2": df.amount, "region2": df.region})\n'
        'out.write.saveAsTable("out")\n'
    ]
    reader = _dflineage.analyze_notebook(cells, SCHEMAS, CTX)
    flows = flows_to(reader, out)
    assert flows["amt2"] == (ORDERS, "amount")
    assert flows["region2"] == (ORDERS, "region")


def test_agg_dict_shorthand_uses_sparks_generated_name():
    out = "ws/lh/out"
    cells = [
        'df = spark.table("orders")\n'
        'out = df.groupBy("region").agg({"amount": "sum"})\n'
        'out.write.saveAsTable("out")\n'
    ]
    reader = _dflineage.analyze_notebook(cells, SCHEMAS, CTX)
    flows = flows_to(reader, out)
    assert flows["sum(amount)"] == (ORDERS, "amount")
    assert flows["region"] == (ORDERS, "region")  # the grouping key survives too


def test_cross_join_treated_like_join():
    out = "ws/lh/out"
    cells = [
        'a = spark.table("orders")\n'
        'b = spark.table("orders")\n'
        'out = a.crossJoin(b)\n'
        'out.write.saveAsTable("out")\n'
    ]
    reader = _dflineage.analyze_notebook(cells, SCHEMAS, CTX)
    flows = flows_to(reader, out)
    assert flows["id"] == (ORDERS, "id")


def test_to_df_renames_every_column_positionally():
    out = "ws/lh/out"
    cells = [
        'df = spark.table("orders")\n'
        'out = df.toDF("order_id", "total", "area")\n'
        'out.write.saveAsTable("out")\n'
    ]
    reader = _dflineage.analyze_notebook(cells, SCHEMAS, CTX)
    flows = flows_to(reader, out)
    assert flows["order_id"] == (ORDERS, "id")
    assert flows["total"] == (ORDERS, "amount")
    assert flows["area"] == (ORDERS, "region")


def test_to_df_abstains_on_a_count_mismatch():
    out = "ws/lh/out"
    cells = [
        'df = spark.table("orders")\n'
        'out = df.toDF("only_one")\n'
        'out.write.saveAsTable("out")\n'
    ]
    reader = _dflineage.analyze_notebook(cells, SCHEMAS, CTX)
    assert flows_to(reader, out) == {}


def test_except_all_keeps_lefts_columns_and_provenance():
    out = "ws/lh/out"
    cells = [
        'a = spark.table("orders")\n'
        'b = spark.table("orders")\n'
        'out = a.exceptAll(b)\n'
        'out.write.saveAsTable("out")\n'
    ]
    reader = _dflineage.analyze_notebook(cells, SCHEMAS, CTX)
    flows = flows_to(reader, out)
    assert flows["id"] == (ORDERS, "id")
    assert flows["amount"] == (ORDERS, "amount")
