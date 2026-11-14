export default function Tag({ children }: { children: string }) {
  return <li className="rounded-full bg-primary-soft px-3 py-1 text-sm font-medium text-primary-darkest">{children}</li>
}
