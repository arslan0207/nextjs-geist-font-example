"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Customer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  trn: string
  contactPerson: string
  projects: string[]
}

interface Project {
  id: string
  name: string
  customerId: string
  description: string
  startDate: string
  endDate: string
  status: string
  budget: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id" | "projects">>({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    trn: "",
    contactPerson: ""
  })

  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    name: "",
    customerId: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Planning",
    budget: 0
  })

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.company) {
      const customer: Customer = {
        ...newCustomer,
        id: Date.now().toString(),
        projects: []
      }
      setCustomers([...customers, customer])
      setNewCustomer({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
        trn: "",
        contactPerson: ""
      })
    }
  }

  const handleAddProject = () => {
    if (newProject.name && newProject.customerId) {
      const project: Project = {
        ...newProject,
        id: Date.now().toString()
      }
      setProjects([...projects, project])
      
      // Update customer's projects list
      setCustomers(customers.map(customer => 
        customer.id === newProject.customerId 
          ? { ...customer, projects: [...customer.projects, project.id] }
          : customer
      ))
      
      setNewProject({
        name: "",
        customerId: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "Planning",
        budget: 0
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Management</h1>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Customer Form */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer-name">Contact Person Name</Label>
                  <Input
                    id="customer-name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="Enter contact person name"
                  />
                </div>
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={newCustomer.company}
                    onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-phone">Phone</Label>
                  <Input
                    id="customer-phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-trn">TRN Number</Label>
                  <Input
                    id="customer-trn"
                    value={newCustomer.trn}
                    onChange={(e) => setNewCustomer({ ...newCustomer, trn: e.target.value })}
                    placeholder="Enter TRN number"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-address">Address</Label>
                  <Textarea
                    id="customer-address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
                <Button onClick={handleAddCustomer} className="w-full">
                  Add Customer
                </Button>
              </div>
            </Card>

            {/* Customers List */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Customers List</h2>
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div key={customer.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{customer.company}</h3>
                    <p className="text-sm text-gray-600">Contact: {customer.name}</p>
                    <p className="text-sm text-gray-600">Email: {customer.email}</p>
                    <p className="text-sm text-gray-600">Phone: {customer.phone}</p>
                    <p className="text-sm text-gray-600">TRN: {customer.trn}</p>
                    <p className="text-sm text-gray-600">Projects: {customer.projects.length}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Project Form */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-customer">Select Customer</Label>
                  <select
                    id="project-customer"
                    className="w-full border rounded-md p-2"
                    value={newProject.customerId}
                    onChange={(e) => setNewProject({ ...newProject, customerId: e.target.value })}
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.company} - {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Enter project description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="project-budget">Budget (AED)</Label>
                  <Input
                    id="project-budget"
                    type="number"
                    value={newProject.budget || ""}
                    onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                    placeholder="Enter project budget"
                  />
                </div>
                <div>
                  <Label htmlFor="project-status">Status</Label>
                  <select
                    id="project-status"
                    className="w-full border rounded-md p-2"
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <Button onClick={handleAddProject} className="w-full">
                  Add Project
                </Button>
              </div>
            </Card>

            {/* Projects List */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Projects List</h2>
              <div className="space-y-4">
                {projects.map((project) => {
                  const customer = customers.find(c => c.id === project.customerId)
                  return (
                    <div key={project.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-gray-600">Customer: {customer?.company}</p>
                      <p className="text-sm text-gray-600">Status: {project.status}</p>
                      <p className="text-sm text-gray-600">Budget: AED {project.budget.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Duration: {project.startDate} to {project.endDate}</p>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
