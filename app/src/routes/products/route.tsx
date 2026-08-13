// Data Products layout — shared title bar and the outlet, mirroring
// fabric/route.tsx. No tab strip: the rail (Products/Domains/Applications/New
// product) already carries the sections.
import { createFileRoute, Outlet } from '@tanstack/react-router'
import '../../products/products.css'

export const Route = createFileRoute('/products')({
  component: ProductsLayout,
})

function ProductsLayout() {
  return (
    <div className="pc-page">
      <Outlet />
    </div>
  )
}
