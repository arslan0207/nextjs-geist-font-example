"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency } from "@/lib/tax-utils"

interface InvoiceItem {
  code: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface Customer {
  id: string
  name: string
  company: string
}

interface Project {
  id: string
  name: string
  customerId: string
}

export default function InvoicesPage() {
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    date: "",
    project: "",
    projectId: "",
    customer: "",
    customerId: "",
    attention: "",
    isCreditInvoice: false,
    creditInvoiceRef: ""
  })

  // Financial controls
  const [financialControls, setFinancialControls] = useState({
    retentionEnabled: false,
    retentionType: "percentage", // "percentage" or "amount"
    retentionValue: 10,
    discountEnabled: false,
    discountType: "percentage",
    discountValue: 0,
    advancePaymentEnabled: false,
    advancePaymentAmount: 0,
    vatCalculationOrder: "after", // "before" or "after" retention/discount
    customDeductionEnabled: false,
    customDeductionLabel: "",
    customDeductionAmount: 0
  })

  const [newItem, setNewItem] = useState<InvoiceItem>({
    code: "",
    description: "",
    quantity: 0,
    unitPrice: 0,
    amount: 0
  })

  // Mock data for customers and projects
  const [customers] = useState<Customer[]>([
    { id: "1", name: "Moath Kofahi", company: "AL DHAFRA INTERNATIONAL PROJECTS GROUP" },
    { id: "2", name: "Ahmed Ali", company: "Emirates Construction LLC" }
  ])

  const [projects] = useState<Project[]>([
    { id: "1", name: "MAIN OFFICE BUILDING FOR ZAKAT FUND ABU DHABI ISLAND", customerId: "1" },
    { id: "2", name: "Villa Construction Project", customerId: "1" },
    { id: "3", name: "Commercial Building Renovation", customerId: "2" }
  ])

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

  const handleUpdateItem = (index: number, updatedItem: Partial<InvoiceItem>) => {
    setItems(items.map((item, i) => i === index ? { ...item, ...updatedItem } : item))
  }

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    setInvoiceData({
      ...invoiceData,
      customerId,
      customer: customer ? `${customer.company} - ${customer.name}` : "",
      projectId: "",
      project: ""
    })
  }

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    setInvoiceData({
      ...invoiceData,
      projectId,
      project: project ? project.name : ""
    })
  }

  // Calculate totals with flexible order
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    
    let workingTotal = subtotal
    let retention = 0
    let discount = 0
    let vat = 0
    const advancePayment = financialControls.advancePaymentEnabled ? financialControls.advancePaymentAmount : 0
    const customDeduction = financialControls.customDeductionEnabled ? financialControls.customDeductionAmount : 0

    // Calculate retention
    if (financialControls.retentionEnabled) {
      if (financialControls.retentionType === "percentage") {
        retention = workingTotal * (financialControls.retentionValue / 100)
      } else {
        retention = financialControls.retentionValue
      }
    }

    // Calculate discount
    if (financialControls.discountEnabled) {
      if (financialControls.discountType === "percentage") {
        discount = workingTotal * (financialControls.discountValue / 100)
      } else {
        discount = financialControls.discountValue
      }
    }

    // Apply VAT calculation order
    if (financialControls.vatCalculationOrder === "before") {
      // VAT calculated before retention/discount
      vat = workingTotal * 0.05
      workingTotal = workingTotal + vat - retention - discount - customDeduction
    } else {
      // VAT calculated after retention/discount
      workingTotal = workingTotal - retention - discount - customDeduction
      vat = workingTotal * 0.05
      workingTotal = workingTotal + vat
    }

    const grandTotal = workingTotal - advancePayment

    return {
      subtotal,
      retention,
      discount,
      vat,
      advancePayment,
      customDeduction,
      grandTotal: Math.max(0, grandTotal)
    }
  }

  const totals = calculateTotals()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Company Header */}
      <Card className="p-6 mb-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">KASHMIR CARPENTRY L.L.C.</h2>
          <p className="text-sm">TRN: 100001752300003</p>
          <p className="text-lg font-semibold mt-2">TAX INVOICE</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Invoice Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="invoice-number">Invoice Number</Label>
              <Input 
                id="invoice-number" 
                value={invoiceData.invoiceNumber}
                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                placeholder="KC INV250402/65/25" 
              />
            </div>
            <div>
              <Label htmlFor="invoice-date">Date</Label>
              <Input 
                id="invoice-date" 
                type="date" 
                value={invoiceData.date}
                onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="customer-select">Select Customer</Label>
              <select
                id="customer-select"
                className="w-full border rounded-md p-2"
                value={invoiceData.customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
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
              <Label htmlFor="project-select">Select Project</Label>
              <select
                id="project-select"
                className="w-full border rounded-md p-2"
                value={invoiceData.projectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                disabled={!invoiceData.customerId}
              >
                <option value="">Select a project</option>
                {projects
                  .filter(project => project.customerId === invoiceData.customerId)
                  .map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <Label htmlFor="attention">Attention</Label>
              <Input 
                id="attention" 
                value={invoiceData.attention}
                onChange={(e) => setInvoiceData({ ...invoiceData, attention: e.target.value })}
                placeholder="ATTN: Contact Person" 
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="credit-invoice"
                checked={invoiceData.isCreditInvoice}
                onCheckedChange={(checked) => setInvoiceData({ ...invoiceData, isCreditInvoice: !!checked })}
              />
              <Label htmlFor="credit-invoice">Credit Invoice</Label>
            </div>
            {invoiceData.isCreditInvoice && (
              <div>
                <Label htmlFor="credit-invoice-ref">Credit Invoice Reference</Label>
                <Input
                  id="credit-invoice-ref"
                  value={invoiceData.creditInvoiceRef}
                  onChange={(e) => setInvoiceData({ ...invoiceData, creditInvoiceRef: e.target.value })}
                  placeholder="Reference Invoice Number"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Financial Controls */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Controls</h2>
          <div className="space-y-4">
            {/* Retention Controls */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="retention-enabled"
                  checked={financialControls.retentionEnabled}
                  onCheckedChange={(checked) => 
                    setFinancialControls({ ...financialControls, retentionEnabled: !!checked })
                  }
                />
                <Label htmlFor="retention-enabled">Enable Retention</Label>
              </div>
              {financialControls.retentionEnabled && (
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="border rounded-md p-2"
                    value={financialControls.retentionType}
                    onChange={(e) => setFinancialControls({ 
                      ...financialControls, 
                      retentionType: e.target.value as "percentage" | "amount" 
                    })}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="amount">Fixed Amount</option>
                  </select>
                  <Input
                    type="number"
                    value={financialControls.retentionValue}
                    onChange={(e) => setFinancialControls({ 
                      ...financialControls, 
                      retentionValue: Number(e.target.value) 
                    })}
                    placeholder={financialControls.retentionType === "percentage" ? "%" : "AED"}
                  />
                </div>
              )}
            </div>

            {/* Discount Controls */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="discount-enabled"
                  checked={financialControls.discountEnabled}
                  onCheckedChange={(checked) => 
                    setFinancialControls({ ...financialControls, discountEnabled: !!checked })
                  }
                />
                <Label htmlFor="discount-enabled">Enable Discount</Label>
              </div>
              {financialControls.discountEnabled && (
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="border rounded-md p-2"
                    value={financialControls.discountType}
                    onChange={(e) => setFinancialControls({ 
                      ...financialControls, 
                      discountType: e.target.value as "percentage" | "amount" 
                    })}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="amount">Fixed Amount</option>
                  </select>
                  <Input
                    type="number"
                    value={financialControls.discountValue}
                    onChange={(e) => setFinancialControls({ 
                      ...financialControls, 
                      discountValue: Number(e.target.value) 
                    })}
                    placeholder={financialControls.discountType === "percentage" ? "%" : "AED"}
                  />
                </div>
              )}
            </div>

            {/* VAT Calculation Order */}
            <div className="border rounded-lg p-4">
              <Label>VAT Calculation Order</Label>
              <select
                className="w-full border rounded-md p-2 mt-2"
                value={financialControls.vatCalculationOrder}
                onChange={(e) => setFinancialControls({ 
                  ...financialControls, 
                  vatCalculationOrder: e.target.value as "before" | "after" 
                })}
              >
                <option value="after">After Retention/Discount</option>
                <option value="before">Before Retention/Discount</option>
              </select>
            </div>

            {/* Advance Payment */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="advance-enabled"
                  checked={financialControls.advancePaymentEnabled}
                  onCheckedChange={(checked) => 
                    setFinancialControls({ ...financialControls, advancePaymentEnabled: !!checked })
                  }
                />
                <Label htmlFor="advance-enabled">Deduct Advance Payment</Label>
              </div>
              {financialControls.advancePaymentEnabled && (
                <Input
                  type="number"
                  value={financialControls.advancePaymentAmount}
                  onChange={(e) => setFinancialControls({ 
                    ...financialControls, 
                    advancePaymentAmount: Number(e.target.value) 
                  })}
                  placeholder="Advance amount in AED"
                />
              )}
            </div>

            {/* Custom Deduction */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="custom-deduction-enabled"
                  checked={financialControls.customDeductionEnabled}
                  onCheckedChange={(checked) => 
                    setFinancialControls({ ...financialControls, customDeductionEnabled: !!checked })
                  }
                />
                <Label htmlFor="custom-deduction-enabled">Custom Deduction</Label>
              </div>
              {financialControls.customDeductionEnabled && (
                <div className="space-y-2">
                  <Input
                    value={financialControls.customDeductionLabel}
                    onChange={(e) => setFinancialControls({ 
                      ...financialControls, 
                      customDeductionLabel: e.target.value 
                    })}
                    placeholder="Deduction label"
                  />
                  <Input
                    type="number"
                    value={financialControls.customDeductionAmount}
                    onChange={(e) => setFinancialControls({ 
                      ...financialControls, 
                      customDeductionAmount: Number(e.target.value) 
                    })}
                    placeholder="Amount in AED"
                  />
                </div>
              )}
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
          <h2 className="text-xl font-semibold mb-4">Invoice Items</h2>
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
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            
            {financialControls.retentionEnabled && (
              <div className="flex justify-between">
                <span>RETENTION ({financialControls.retentionType === "percentage" ? `${financialControls.retentionValue}%` : "Fixed"}):</span>
                <span>-{formatCurrency(totals.retention)}</span>
              </div>
            )}
            
            {financialControls.discountEnabled && (
              <div className="flex justify-between">
                <span>DISCOUNT ({financialControls.discountType === "percentage" ? `${financialControls.discountValue}%` : "Fixed"}):</span>
                <span>-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            
            {financialControls.customDeductionEnabled && (
              <div className="flex justify-between">
                <span>{financialControls.customDeductionLabel || "CUSTOM DEDUCTION"}:</span>
                <span>-{formatCurrency(totals.customDeduction)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>VAT 5% ({financialControls.vatCalculationOrder === "before" ? "Before" : "After"} deductions):</span>
              <span>{formatCurrency(totals.vat)}</span>
            </div>
            
            {financialControls.advancePaymentEnabled && (
              <div className="flex justify-between">
                <span>ADVANCE PAYMENT:</span>
                <span>-{formatCurrency(totals.advancePayment)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>GRAND TOTAL:</span>
              <span>{formatCurrency(totals.grandTotal)}</span>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p className="mb-2">NOTE: AS PER (FTA) UAE VAT 5% WILL BE CHARGE IN EACH BILL AS PER WORK PROGRESS/PERCENTAGE</p>
            <p>MAKE ALL CHEQUES PAYABLE TO KASHMIR CARPENTRY L.L.C.</p>
            {invoiceData.project && (
              <p className="mt-2">PROJECT: {invoiceData.project}</p>
            )}
          </div>

          <Button className="w-full mt-6">
            Generate Invoice
          </Button>
        </Card>
      </div>
    </div>
  )
}
