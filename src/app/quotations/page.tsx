"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/tax-utils"

interface QuotationItem {
  code: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export default function QuotationsPage() {
  const [items, setItems] = useState<QuotationItem[]>([])
  const [quotationData, setQuotationData] = useState({
    quotationNumber: "",
    date: "",
    project: "",
    client: "",
    attention: "",
    validity: "",
    paymentTerms: "",
    terms: "",
    isCreditQuotation: false,
    creditQuotationRef: ""
  })
  const [newItem, setNewItem] = useState<QuotationItem>({
    code: "",
    description: "",
    quantity: 0,
    unitPrice: 0,
    amount: 0
  })

  const handleAddItem = () => {
    if (newItem.description && newItem.quantity > 0 && newItem.unitPrice > 0) {
      const amount = newItem.quantity * newItem.unitPrice
      setItems([...items, { ...newItem, amount }])
      setNewItem({
        code: "",
        description: "",
        quantity: 0,
        unitPrice: 0,
        amount: 0
      })
    }
  }

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleUpdateItem = (index: number, updatedItem: Partial<QuotationItem>) => {
    setItems(items.map((item, i) => i === index ? { ...item, ...updatedItem } : item))
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const vat = subtotal * 0.05 // 5% VAT only for quotations
  const total = subtotal + vat

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Company Header */}
      <Card className="p-6 mb-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">KASHMIR CARPENTRY L.L.C.</h2>
          <p className="text-sm">TRN: 100001752300003</p>
          <p className="text-lg font-semibold mt-2">QUOTATION</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quotation Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quotation Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="quotation-number">Quotation Number</Label>
              <Input 
                id="quotation-number" 
                value={quotationData.quotationNumber}
                onChange={(e) => setQuotationData({ ...quotationData, quotationNumber: e.target.value })}
                placeholder="KC QUO250402/65/25" 
              />
            </div>
            <div>
              <Label htmlFor="quotation-date">Date</Label>
              <Input 
                id="quotation-date" 
                type="date" 
                value={quotationData.date}
                onChange={(e) => setQuotationData({ ...quotationData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="project">Project</Label>
              <Textarea 
                id="project" 
                value={quotationData.project}
                onChange={(e) => setQuotationData({ ...quotationData, project: e.target.value })}
                placeholder="PROJECT: MAIN OFFICE BUILDING FOR ZAKAT FUND ABU DHABI ISLAND" 
              />
            </div>
            <div>
              <Label htmlFor="client">Client</Label>
              <Input 
                id="client" 
                value={quotationData.client}
                onChange={(e) => setQuotationData({ ...quotationData, client: e.target.value })}
                placeholder="M/S: AL DHAFRA INTERNATIONAL PROJECTS GROUP" 
              />
            </div>
            <div>
              <Label htmlFor="attention">Attention</Label>
              <Input 
                id="attention" 
                value={quotationData.attention}
                onChange={(e) => setQuotationData({ ...quotationData, attention: e.target.value })}
                placeholder="ATTN: Moath Kofahi" 
              />
            </div>
          </div>
        </Card>

        {/* Quotation Terms */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="validity">Validity Period (Days)</Label>
              <Input 
                id="validity" 
                type="number" 
                value={quotationData.validity}
                onChange={(e) => setQuotationData({ ...quotationData, validity: e.target.value })}
                placeholder="30" 
              />
            </div>
            <div>
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <Input 
                id="payment-terms" 
                value={quotationData.paymentTerms}
                onChange={(e) => setQuotationData({ ...quotationData, paymentTerms: e.target.value })}
                placeholder="Net 30 days" 
              />
            </div>
            <div>
              <Label htmlFor="terms">Terms and Conditions</Label>
              <Textarea 
                id="terms" 
                value={quotationData.terms}
                onChange={(e) => setQuotationData({ ...quotationData, terms: e.target.value })}
                placeholder="Enter terms and conditions"
                className="h-32"
              />
            </div>
          </div>
        </Card>

        {/* Add Items */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add Items</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-code">Item Code</Label>
              <Input
                id="item-code"
                value={newItem.code}
                onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                placeholder="T01, T02, etc."
              />
            </div>
            <div>
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="FLUSH FIRERATED 2HR (100X210) STAIRCASE"
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
                <Label htmlFor="item-price">Unit Price</Label>
                <Input
                  id="item-price"
                  type="number"
                  value={newItem.unitPrice || ""}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                  placeholder="Unit Price"
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
          <h2 className="text-xl font-semibold mb-4">Quotation Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">SR</th>
                  <th className="text-left p-2">CODE</th>
                  <th className="text-left p-2">DESCRIPTION</th>
                  <th className="text-right p-2">QTY</th>
                  <th className="text-right p-2">U.PRICE</th>
                  <th className="text-right p-2">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.code}</td>
                    <td className="p-2">{item.description}</td>
                    <td className="text-right p-2">{item.quantity}</td>
                    <td className="text-right p-2">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right p-2">{formatCurrency(item.amount)}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          const newDescription = prompt("Edit Description", item.description)
                          if (newDescription !== null) {
                            handleUpdateItem(index, { description: newDescription })
                          }
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this item?")) {
                            handleDeleteItem(index)
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>SUBTOTAL:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT 5%:</span>
              <span>{formatCurrency(vat)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>TOTAL:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p className="mb-2">NOTE: AS PER (FTA) UAE VAT 5% WILL BE CHARGE IN EACH BILL AS PER WORK PROGRESS/PERCENTAGE</p>
            <p>MAKE ALL CHEQUES PAYABLE TO KASHMIR CARPENTRY L.L.C.</p>
            <p className="mt-2">Validity: {quotationData.validity} days from date of quotation</p>
          </div>

          <Button className="w-full mt-6">
            Generate Quotation
          </Button>
        </Card>
      </div>
    </div>
  )
}
