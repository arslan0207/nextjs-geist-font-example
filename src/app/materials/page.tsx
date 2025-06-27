"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/tax-utils"

interface Material {
  id: string
  name: string
  description: string
  supplier: string
  unit: string
  unitPrice: number
  quantity: number
  minimumStock: number
  isCredit?: boolean
  creditRef?: string
}

interface MaterialTransaction {
  id: string
  materialId: string
  type: "in" | "out"
  quantity: number
  date: string
  notes: string
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [transactions, setTransactions] = useState<MaterialTransaction[]>([])

  const [newMaterial, setNewMaterial] = useState<Omit<Material, "id">>({
    name: "",
    description: "",
    supplier: "",
    unit: "",
    unitPrice: 0,
    quantity: 0,
    minimumStock: 0
  })

  const [newTransaction, setNewTransaction] = useState<Omit<MaterialTransaction, "id">>({
    materialId: "",
    type: "in",
    quantity: 0,
    date: "",
    notes: ""
  })

  const handleAddMaterial = () => {
    if (newMaterial.name && newMaterial.unitPrice > 0) {
      const material: Material = {
        ...newMaterial,
        id: Date.now().toString()
      }
      setMaterials([...materials, material])
      setNewMaterial({
        name: "",
        description: "",
        supplier: "",
        unit: "",
        unitPrice: 0,
        quantity: 0,
        minimumStock: 0,
        isCredit: false,
        creditRef: ""
      })
    }
  }


  const handleAddTransaction = () => {
    if (newTransaction.materialId && newTransaction.quantity > 0) {
      const transaction: MaterialTransaction = {
        ...newTransaction,
        id: Date.now().toString()
      }
      setTransactions([...transactions, transaction])

      // Update material quantity
      const updatedMaterials = materials.map(material => {
        if (material.id === newTransaction.materialId) {
          const quantityChange = newTransaction.type === "in" ? 
            newTransaction.quantity : 
            -newTransaction.quantity
          return {
            ...material,
            quantity: material.quantity + quantityChange
          }
        }
        return material
      })
      setMaterials(updatedMaterials)

      setNewTransaction({
        materialId: "",
        type: "in",
        quantity: 0,
        date: "",
        notes: ""
      })
    }
  }

  const getLowStockMaterials = () => {
    return materials.filter(material => material.quantity <= material.minimumStock)
  }

  const getTotalInventoryValue = () => {
    return materials.reduce((total, material) => {
      return total + (material.quantity * material.unitPrice)
    }, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Materials Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Inventory Summary Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Materials:</span>
              <span className="font-semibold">{materials.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Low Stock Items:</span>
              <span className="font-semibold text-red-600">{getLowStockMaterials().length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Value:</span>
              <span className="font-semibold">{formatCurrency(getTotalInventoryValue())}</span>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Material Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Add New Material</h3>
                <div>
                  <Label htmlFor="material-name">Material Name</Label>
                  <Input
                    id="material-name"
                    value={newMaterial.name}
                    onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                    placeholder="Enter material name"
                  />
                </div>
                <div>
                  <Label htmlFor="material-description">Description</Label>
                  <Textarea
                    id="material-description"
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <Label htmlFor="material-supplier">Supplier</Label>
                  <Input
                    id="material-supplier"
                    value={newMaterial.supplier}
                    onChange={(e) => setNewMaterial({ ...newMaterial, supplier: e.target.value })}
                    placeholder="Enter supplier name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="material-unit">Unit</Label>
                    <Input
                      id="material-unit"
                      value={newMaterial.unit}
                      onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                      placeholder="e.g., kg, pcs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="material-price">Unit Price</Label>
                    <Input
                      id="material-price"
                      type="number"
                      value={newMaterial.unitPrice || ""}
                      onChange={(e) => setNewMaterial({ ...newMaterial, unitPrice: Number(e.target.value) })}
                      placeholder="Enter unit price"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="material-quantity">Initial Quantity</Label>
                    <Input
                      id="material-quantity"
                      type="number"
                      value={newMaterial.quantity || ""}
                      onChange={(e) => setNewMaterial({ ...newMaterial, quantity: Number(e.target.value) })}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="material-min-stock">Minimum Stock</Label>
                    <Input
                      id="material-min-stock"
                      type="number"
                      value={newMaterial.minimumStock || ""}
                      onChange={(e) => setNewMaterial({ ...newMaterial, minimumStock: Number(e.target.value) })}
                      placeholder="Enter min stock"
                    />
                  </div>
                </div>
                <Button onClick={handleAddMaterial} className="w-full">
                  Add Material
                </Button>
              </div>

              {/* Materials List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Materials List</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Supplier</th>
                        <th className="text-right p-2">Quantity</th>
                        <th className="text-right p-2">Unit Price</th>
                        <th className="text-right p-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map((material) => (
                        <tr 
                          key={material.id} 
                          className={`border-b ${
                            material.quantity <= material.minimumStock ? "bg-red-50" : ""
                          }`}
                        >
                          <td className="p-2">{material.name}</td>
                          <td className="p-2">{material.supplier}</td>
                          <td className="text-right p-2">
                            {material.quantity} {material.unit}
                          </td>
                          <td className="text-right p-2">{formatCurrency(material.unitPrice)}</td>
                          <td className="text-right p-2">
                            {formatCurrency(material.quantity * material.unitPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Transaction Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Record Transaction</h3>
                <div>
                  <Label htmlFor="transaction-material">Select Material</Label>
                  <select
                    id="transaction-material"
                    className="w-full border rounded-md p-2"
                    value={newTransaction.materialId}
                    onChange={(e) => setNewTransaction({ ...newTransaction, materialId: e.target.value })}
                  >
                    <option value="">Select a material</option>
                    {materials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="transaction-type">Transaction Type</Label>
                  <select
                    id="transaction-type"
                    className="w-full border rounded-md p-2"
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as "in" | "out" })}
                  >
                    <option value="in">Stock In</option>
                    <option value="out">Stock Out</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="transaction-quantity">Quantity</Label>
                  <Input
                    id="transaction-quantity"
                    type="number"
                    value={newTransaction.quantity || ""}
                    onChange={(e) => setNewTransaction({ ...newTransaction, quantity: Number(e.target.value) })}
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <Label htmlFor="transaction-date">Date</Label>
                  <Input
                    id="transaction-date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="transaction-notes">Notes</Label>
                  <Textarea
                    id="transaction-notes"
                    value={newTransaction.notes}
                    onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
                    placeholder="Enter transaction notes"
                  />
                </div>
                <Button onClick={handleAddTransaction} className="w-full">
                  Record Transaction
                </Button>
              </div>

              {/* Transactions List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Material</th>
                        <th className="text-center p-2">Date</th>
                        <th className="text-center p-2">Type</th>
                        <th className="text-right p-2">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => {
                        const material = materials.find(m => m.id === transaction.materialId)
                        return (
                          <tr key={transaction.id} className="border-b">
                            <td className="p-2">{material?.name}</td>
                            <td className="text-center p-2">{transaction.date}</td>
                            <td className="text-center p-2">
                              <span className={transaction.type === "in" ? "text-green-600" : "text-red-600"}>
                                {transaction.type === "in" ? "Stock In" : "Stock Out"}
                              </span>
                            </td>
                            <td className="text-right p-2">
                              {transaction.quantity} {material?.unit}
                            </td>
                          </tr>
                        )
                      })}
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
