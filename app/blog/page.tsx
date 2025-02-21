import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      <p className="text-xl mb-8">Coming Soon! We&apos;re working on some great content for you.</p>
      <Link href="/" passHref>
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}

