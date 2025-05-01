import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'

function Hello() {
  return <h1>Hello, test!</h1>
}

test('renders Hello component', () => {
  render(<Hello />)
  expect(screen.getByText(/Hello, test/i)).toBeInTheDocument()
})