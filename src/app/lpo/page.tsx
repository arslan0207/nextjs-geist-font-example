"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/tax-utils"

interface LPOItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export default function LPOPage() {
  const [items, setItems] = useState<LPOItem[]>([])
  const [newItem, setNewItem] = useState<LPOItem>({
    description: "",
    quantity: 0,
    rate: 0,
    amount: 0
  })

  const handleAddItem = () => {
    if (newItem.description && newItem.quantity > 0 && newItem.rate > 0) {
      const amount = newItem.quantity * newItem.rate
      setItems([...items, { ...newItem, amount }])
      setNewItem({
        description: "",
        quantity: 0,
        rate: 0,
        amount: 0
      })
    }
  }

  const total = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Local Purchase Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Supplier Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Supplier Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="supplier-name">Supplier Name</Label>
              <Input id="supplier-name" placeholder="Enter supplier name" />
            </div>
            <div>
              <Label htmlFor="supplier-address">Address</Label>
              <Input id="supplier-address" placeholder="Enter address" />
            </div>
            <div>
              <Label htmlFor="supplier-contact">Contact Person</Label>
              <Input id="supplier-contact" placeholder="Enter contact person" />
            </div>
            <div>
              <Label htmlFor="supplier-phone">Phone Number</Label>
              <Input id="supplier-phone" placeholder="Enter phone number" />
            </div>
          </div>
        </Card>

        {/* LPO Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">LPO Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lpo-number">LPO Number</Label>
              <Input id="lpo-number" placeholder="Enter LPO number" />
            </div>
            <div>
              <Label htmlFor="lpo-date">Date</Label>
              <Input id="lpo-date" type="date" />
            </div>
            <div>
              <Label htmlFor="delivery-date">Expected Delivery Date</Label>
              <Input id="delivery-date" type="date" />
            </div>
            <div>
              <Label htmlFor="delivery-terms">Delivery Terms</Label>
              <Textarea 
                id="delivery-terms" 
                placeholder="Enter delivery terms"
                className="h-20"
              />
            </div>
          </div>
        </Card>

        {/* Add Items */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add Items</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-description">Description</Label>
              <Input
                id="item-description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Item description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="item-quantity">Quantity</Label>
                <Input
                  id="item-quantity"
                  type="number"
                  value={newItem.quantity || ""}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  placeholder="Quantity"
                />
              </div>
              <div>
                <Label htmlFor="item-rate">Rate</Label>
                <Input
                  id="item-rate"
                  type="number"
                  value={newItem.rate || ""}
                  onChange={(e) => setNewItem({ ...newItem, rate: Number(e.target.value) })}
                  placeholder="Rate"
                />
              </div>
            </div>
            <Button onClick={handleAddItem} className="w-full">
              Add Item
            </Button>
          </div>
        </Card>

        {/* Items List */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Purchase Order Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Description</th>
                  <th className="text-right p-2">Quantity</th>
                  <th className="text-right p-2">Rate</th>
                  <th className="text-right p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.description}</td>
                    <td className="text-right p-2">{item.quantity}</td>
                    <td className="text-right p-2">{formatCurrency(item.rate)}</td>
                    <td className="text-right p-2">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-4">
            <div className="flex justify-between font-bold">
              <span>Total Amount:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Terms and Authorization */}
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <Textarea 
                id="payment-terms" 
                placeholder="Enter payment terms"
                className="h-20"
              />
            </div>
            <div>
              <Label htmlFor="special-instructions">Special Instructions</Label>
              <Textarea 
                id="special-instructions" 
                placeholder="Enter any special instructions"
                className="h-20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button className="w-full">
              Save as Draft
            </Button>
            <Button className="w-full">
              Generate LPO
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
