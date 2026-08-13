// The Model Browser — the app's landing screen.
import { createFileRoute } from '@tanstack/react-router'
import ModelBrowser from '../modeling/ModelBrowser'

export const Route = createFileRoute('/models')({
  component: ModelBrowser,
})
