"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Supplier {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  notes: string
  isCredit?: boolean
  creditRef?: string
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, "id">>({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    isCredit: false,
    creditRef: ""
  })

  const handleAddSupplier = () => {
    if (newSupplier.name) {
      const supplier: Supplier = {
        ...newSupplier,
        id: Date.now().toString()
      }
      setSuppliers([...suppliers, supplier])
      setNewSupplier({
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
        isCredit: false,
        creditRef: ""
      })
    }
  }

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id))
  }

  const handleUpdateSupplier = (id: string, updated: Partial<Supplier>) => {
    setSuppliers(suppliers.map(s => s.id === id ? { ...s, ...updated } : s))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Suppliers Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Supplier Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Supplier</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="supplier-name">Supplier Name</Label>
              <Input
                id="supplier-name"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                placeholder="Enter supplier name"
              />
            </div>
            <div>
              <Label htmlFor="contact-person">Contact Person</Label>
              <Input
                id="contact-person"
                value={newSupplier.contactPerson}
                onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                placeholder="Enter contact person"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newSupplier.notes}
                onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                placeholder="Additional notes"
              />
            </div>
            <Button onClick={handleAddSupplier} className="w-full">
              Add Supplier
            </Button>
          </div>
        </Card>

        {/* Suppliers List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Suppliers List</h2>
          <div className="space-y-4">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{supplier.name}</h3>
                <p className="text-sm text-gray-600">Contact: {supplier.contactPerson}</p>
                <p className="text-sm text-gray-600">Phone: {supplier.phone}</p>
                <p className="text-sm text-gray-600">Email: {supplier.email}</p>
                <p className="text-sm text-gray-600">Address: {supplier.address}</p>
                <p className="text-sm text-gray-600">Notes: {supplier.notes}</p>
                <div className="mt-2 flex space-x-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSupplier(supplier.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
