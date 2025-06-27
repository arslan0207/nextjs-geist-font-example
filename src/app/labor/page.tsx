"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/tax-utils"

interface Worker {
  id: string
  name: string
  role: string
  contactNumber: string
  email: string
  hourlyRate: number
  joinDate: string
  isCredit?: boolean
  creditRef?: string
}

interface Attendance {
  workerId: string
  date: string
  hoursWorked: number
  overtime: number
}

interface Salary {
  workerId: string
  month: string
  regularHours: number
  overtimeHours: number
  regularAmount: number
  overtimeAmount: number
  totalAmount: number
}

export default function LaborPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [salaries, setSalaries] = useState<Salary[]>([])

  const [newWorker, setNewWorker] = useState<Omit<Worker, "id">>({
    name: "",
    role: "",
    contactNumber: "",
    email: "",
    hourlyRate: 0,
    joinDate: "",
    isCredit: false,
    creditRef: ""
  })

  const handleAddWorker = () => {
    if (newWorker.name && newWorker.role && newWorker.hourlyRate > 0) {
      const worker: Worker = {
        ...newWorker,
        id: Date.now().toString()
      }
      setWorkers([...workers, worker])
      setNewWorker({
        name: "",
        role: "",
        contactNumber: "",
        email: "",
        hourlyRate: 0,
        joinDate: "",
        isCredit: false,
        creditRef: ""
      })
    }
  }


  const [newAttendance, setNewAttendance] = useState<Attendance>({
    workerId: "",
    date: "",
    hoursWorked: 0,
    overtime: 0
  })

  const handleAddAttendance = () => {
    if (newAttendance.workerId && newAttendance.date && newAttendance.hoursWorked > 0) {
      setAttendance([...attendance, newAttendance])
      setNewAttendance({
        workerId: "",
        date: "",
        hoursWorked: 0,
        overtime: 0
      })

      // Calculate and update salary
      const worker = workers.find(w => w.id === newAttendance.workerId)
      if (worker) {
        const regularAmount = newAttendance.hoursWorked * worker.hourlyRate
        const overtimeAmount = newAttendance.overtime * (worker.hourlyRate * 1.5)
        const salary: Salary = {
          workerId: worker.id,
          month: new Date(newAttendance.date).toISOString().slice(0, 7),
          regularHours: newAttendance.hoursWorked,
          overtimeHours: newAttendance.overtime,
          regularAmount,
          overtimeAmount,
          totalAmount: regularAmount + overtimeAmount
        }
        setSalaries([...salaries, salary])
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Labor Management</h1>

      <Tabs defaultValue="workers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workers">Workers</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="salaries">Salaries</TabsTrigger>
        </TabsList>

        <TabsContent value="workers">
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Worker Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Add New Worker</h3>
                <div>
                  <Label htmlFor="worker-name">Full Name</Label>
                  <Input
                    id="worker-name"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="worker-role">Role</Label>
                  <Input
                    id="worker-role"
                    value={newWorker.role}
                    onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
                    placeholder="Enter role"
                  />
                </div>
                <div>
                  <Label htmlFor="worker-contact">Contact Number</Label>
                  <Input
                    id="worker-contact"
                    value={newWorker.contactNumber}
                    onChange={(e) => setNewWorker({ ...newWorker, contactNumber: e.target.value })}
                    placeholder="Enter contact number"
                  />
                </div>
                <div>
                  <Label htmlFor="worker-email">Email</Label>
                  <Input
                    id="worker-email"
                    type="email"
                    value={newWorker.email}
                    onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <Label htmlFor="worker-rate">Hourly Rate</Label>
                  <Input
                    id="worker-rate"
                    type="number"
                    value={newWorker.hourlyRate || ""}
                    onChange={(e) => setNewWorker({ ...newWorker, hourlyRate: Number(e.target.value) })}
                    placeholder="Enter hourly rate"
                  />
                </div>
                <div>
                  <Label htmlFor="worker-join-date">Join Date</Label>
                  <Input
                    id="worker-join-date"
                    type="date"
                    value={newWorker.joinDate}
                    onChange={(e) => setNewWorker({ ...newWorker, joinDate: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddWorker} className="w-full">
                  Add Worker
                </Button>
              </div>

              {/* Workers List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Workers List</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-right p-2">Rate</th>
                        <th className="text-center p-2">Join Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workers.map((worker) => (
                        <tr key={worker.id} className="border-b">
                          <td className="p-2">{worker.name}</td>
                          <td className="p-2">{worker.role}</td>
                          <td className="text-right p-2">{formatCurrency(worker.hourlyRate)}</td>
                          <td className="text-center p-2">{worker.joinDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Attendance Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Record Attendance</h3>
                <div>
                  <Label htmlFor="attendance-worker">Select Worker</Label>
                  <select
                    id="attendance-worker"
                    className="w-full border rounded-md p-2"
                    value={newAttendance.workerId}
                    onChange={(e) => setNewAttendance({ ...newAttendance, workerId: e.target.value })}
                  >
                    <option value="">Select a worker</option>
                    {workers.map((worker) => (
                      <option key={worker.id} value={worker.id}>
                        {worker.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="attendance-date">Date</Label>
                  <Input
                    id="attendance-date"
                    type="date"
                    value={newAttendance.date}
                    onChange={(e) => setNewAttendance({ ...newAttendance, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="hours-worked">Regular Hours</Label>
                  <Input
                    id="hours-worked"
                    type="number"
                    value={newAttendance.hoursWorked || ""}
                    onChange={(e) => setNewAttendance({ ...newAttendance, hoursWorked: Number(e.target.value) })}
                    placeholder="Enter regular hours"
                  />
                </div>
                <div>
                  <Label htmlFor="overtime">Overtime Hours</Label>
                  <Input
                    id="overtime"
                    type="number"
                    value={newAttendance.overtime || ""}
                    onChange={(e) => setNewAttendance({ ...newAttendance, overtime: Number(e.target.value) })}
                    placeholder="Enter overtime hours"
                  />
                </div>
                <Button onClick={handleAddAttendance} className="w-full">
                  Record Attendance
                </Button>
              </div>

              {/* Attendance List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Worker</th>
                        <th className="text-center p-2">Date</th>
                        <th className="text-right p-2">Regular Hours</th>
                        <th className="text-right p-2">Overtime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((record, index) => {
                        const worker = workers.find(w => w.id === record.workerId)
                        return (
                          <tr key={index} className="border-b">
                            <td className="p-2">{worker?.name}</td>
                            <td className="text-center p-2">{record.date}</td>
                            <td className="text-right p-2">{record.hoursWorked}</td>
                            <td className="text-right p-2">{record.overtime}</td>
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

        <TabsContent value="salaries">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Salary Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Worker</th>
                    <th className="text-center p-2">Month</th>
                    <th className="text-right p-2">Regular Hours</th>
                    <th className="text-right p-2">Overtime Hours</th>
                    <th className="text-right p-2">Regular Amount</th>
                    <th className="text-right p-2">Overtime Amount</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((salary, index) => {
                    const worker = workers.find(w => w.id === salary.workerId)
                    return (
                      <tr key={index} className="border-b">
                        <td className="p-2">{worker?.name}</td>
                        <td className="text-center p-2">{salary.month}</td>
                        <td className="text-right p-2">{salary.regularHours}</td>
                        <td className="text-right p-2">{salary.overtimeHours}</td>
                        <td className="text-right p-2">{formatCurrency(salary.regularAmount)}</td>
                        <td className="text-right p-2">{formatCurrency(salary.overtimeAmount)}</td>
                        <td className="text-right p-2 font-semibold">{formatCurrency(salary.totalAmount)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
