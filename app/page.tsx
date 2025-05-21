import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, MessageSquare } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">ChronoMind</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 dark:from-gray-950 dark:to-gray-900">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Manage Your Time with <span className="text-emerald-600">AI Assistance</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              ChronoMind helps you organize your schedule, manage recurring activities, and gain insights into better
              time utilization through an intelligent AI assistant.
            </p>
            <div className="mt-10">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg border p-6 text-center">
                <Calendar className="mb-4 h-10 w-10 text-emerald-600" />
                <h3 className="mb-2 text-xl font-medium">Intuitive Calendar</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  View and manage your schedule with daily, weekly, and monthly calendar views.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border p-6 text-center">
                <Clock className="mb-4 h-10 w-10 text-emerald-600" />
                <h3 className="mb-2 text-xl font-medium">Recurring Activities</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Easily set up and manage recurring tasks and events with flexible scheduling options.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border p-6 text-center">
                <MessageSquare className="mb-4 h-10 w-10 text-emerald-600" />
                <h3 className="mb-2 text-xl font-medium">AI Assistant</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Chat with an AI assistant that helps you manage your time and suggests optimal scheduling.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20 dark:bg-gray-900">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold">Ready to optimize your time?</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Join ChronoMind today and start managing your schedule more effectively with AI assistance.
              </p>
              <div className="mt-8">
                <Link href="/signup">
                  <Button size="lg">Create Your Account</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} ChronoMind. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
