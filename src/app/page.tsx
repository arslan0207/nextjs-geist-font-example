"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const modules = [
    {
      title: "Customers",
      description: "Manage customers and their projects",
      href: "/customers"
    },
    {
      title: "Invoices",
      description: "Create and manage invoices with flexible tax calculations",
      href: "/invoices"
    },
    {
      title: "Quotations",
      description: "Generate and track quotations",
      href: "/quotations"
    },
    {
      title: "LPO",
      description: "Manage Local Purchase Orders",
      href: "/lpo"
    },
    {
      title: "Projects",
      description: "Track project progress and costs",
      href: "/projects"
    },
    {
      title: "Labor",
      description: "Manage labor details and salaries",
      href: "/labor"
    },
    {
      title: "Materials",
      description: "Track material inventory and costs",
      href: "/materials"
    },
    {
      title: "Suppliers",
      description: "Manage suppliers and their details",
      href: "/suppliers"
    },
    {
      title: "Reports",
      description: "Generate financial reports and tax calculations",
      href: "/reports"
    }
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Kashmir Carpentry LLC</h1>
        <p className="text-gray-600">Project Management and Invoicing System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.title} className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">{module.title}</h2>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <Link href={module.href}>
              <Button className="w-full">
                Access {module.title}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </main>
  )
}
