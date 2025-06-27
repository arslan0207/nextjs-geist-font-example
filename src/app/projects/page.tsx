"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, calculateProjectProfitLoss } from "@/lib/tax-utils"

interface ProjectExpense {
  description: string
  category: string
  amount: number
}

interface LaborCost {
  name: string
  role: string
  hours: number
  rate: number
  amount: number
}

export default function ProjectsPage() {
  const [expenses, setExpenses] = useState<ProjectExpense[]>([])
  const [laborCosts, setLaborCosts] = useState<LaborCost[]>([])
  const [newExpense, setNewExpense] = useState<ProjectExpense>({
    description: "",
    category: "",
    amount: 0
  })
  const [newLabor, setNewLabor] = useState<LaborCost>({
    name: "",
    role: "",
    hours: 0,
    rate: 0,
    amount: 0
  })

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.category && newExpense.amount > 0) {
      setExpenses([...expenses, newExpense])
      setNewExpense({
        description: "",
        category: "",
        amount: 0
      })
    }
  }

  const handleAddLabor = () => {
    if (newLabor.name && newLabor.role && newLabor.hours > 0 && newLabor.rate > 0) {
      const amount = newLabor.hours * newLabor.rate
      setLaborCosts([...laborCosts, { ...newLabor, amount }])
      setNewLabor({
        name: "",
        role: "",
        hours: 0,
        rate: 0,
        amount: 0
      })
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalLabor = laborCosts.reduce((sum, labor) => sum + labor.amount, 0)
  const totalCosts = totalExpenses + totalLabor

  // Example project revenue (in real app, this would come from invoices/payments)
  const projectRevenue = 50000
  const profitLoss = calculateProjectProfitLoss(projectRevenue, totalCosts)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Project Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Project Overview Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" placeholder="Enter project name" />
            </div>
            <div>
              <Label htmlFor="project-client">Client</Label>
              <Input id="project-client" placeholder="Enter client name" />
            </div>
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" />
            </div>
            <div>
              <Label htmlFor="end-date">Expected Completion</Label>
              <Input id="end-date" type="date" />
            </div>
          </div>
        </Card>

        {/* Financial Summary Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Revenue:</span>
              <span className="font-semibold">{formatCurrency(projectRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Expenses:</span>
              <span className="font-semibold">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Labor:</span>
              <span className="font-semibold">{formatCurrency(totalLabor)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Costs:</span>
              <span className="font-semibold">{formatCurrency(totalCosts)}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between font-bold">
                <span>{profitLoss.isProfit ? "Profit" : "Loss"}:</span>
                <span className={profitLoss.isProfit ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(profitLoss.profit)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Margin:</span>
                <span>{profitLoss.profitMargin.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Project Status Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Project Status</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Current Status</Label>
              <Input id="status" placeholder="Enter current status" />
            </div>
            <div>
              <Label htmlFor="completion">Completion (%)</Label>
              <Input id="completion" type="number" placeholder="Enter completion percentage" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Enter project notes"
                className="h-32"
              />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="labor">Labor</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Expense Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Add Expense</h3>
                <div>
                  <Label htmlFor="expense-description">Description</Label>
                  <Input
                    id="expense-description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="Expense description"
                  />
                </div>
                <div>
                  <Label htmlFor="expense-category">Category</Label>
                  <Input
                    id="expense-category"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    placeholder="Expense category"
                  />
                </div>
                <div>
                  <Label htmlFor="expense-amount">Amount</Label>
                  <Input
                    id="expense-amount"
                    type="number"
                    value={newExpense.amount || ""}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    placeholder="Amount"
                  />
                </div>
                <Button onClick={handleAddExpense} className="w-full">
                  Add Expense
                </Button>
              </div>

              {/* Expenses List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Expenses List</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-right p-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((expense, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{expense.description}</td>
                          <td className="p-2">{expense.category}</td>
                          <td className="text-right p-2">{formatCurrency(expense.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="labor">
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Labor Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Add Labor Cost</h3>
                <div>
                  <Label htmlFor="labor-name">Name</Label>
                  <Input
                    id="labor-name"
                    value={newLabor.name}
                    onChange={(e) => setNewLabor({ ...newLabor, name: e.target.value })}
                    placeholder="Worker name"
                  />
                </div>
                <div>
                  <Label htmlFor="labor-role">Role</Label>
                  <Input
                    id="labor-role"
                    value={newLabor.role}
                    onChange={(e) => setNewLabor({ ...newLabor, role: e.target.value })}
                    placeholder="Worker role"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="labor-hours">Hours</Label>
                    <Input
                      id="labor-hours"
                      type="number"
                      value={newLabor.hours || ""}
                      onChange={(e) => setNewLabor({ ...newLabor, hours: Number(e.target.value) })}
                      placeholder="Hours worked"
                    />
                  </div>
                  <div>
                    <Label htmlFor="labor-rate">Hourly Rate</Label>
                    <Input
                      id="labor-rate"
                      type="number"
                      value={newLabor.rate || ""}
                      onChange={(e) => setNewLabor({ ...newLabor, rate: Number(e.target.value) })}
                      placeholder="Rate per hour"
                    />
                  </div>
                </div>
                <Button onClick={handleAddLabor} className="w-full">
                  Add Labor Cost
                </Button>
              </div>

              {/* Labor Costs List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Labor Costs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-right p-2">Hours</th>
                        <th className="text-right p-2">Rate</th>
                        <th className="text-right p-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laborCosts.map((labor, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{labor.name}</td>
                          <td className="p-2">{labor.role}</td>
                          <td className="text-right p-2">{labor.hours}</td>
                          <td className="text-right p-2">{formatCurrency(labor.rate)}</td>
                          <td className="text-right p-2">{formatCurrency(labor.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
