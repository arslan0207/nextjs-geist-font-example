"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  formatCurrency, 
  generateFinancialReport, 
  calculateUAECorporateTax,
  type FinancialReportData 
} from "@/lib/tax-utils"

export default function ReportsPage() {
  const [reportData, setReportData] = useState<FinancialReportData | null>(null)
  const [formData, setFormData] = useState({
    revenue: 0,
    expenses: 0,
    period: ""
  })

  const handleGenerateReport = () => {
    const report = generateFinancialReport(
      formData.revenue,
      formData.expenses,
      formData.period
    )
    setReportData(report)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Financial Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                type="month"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="revenue">Total Revenue (AED)</Label>
              <Input
                id="revenue"
                type="number"
                value={formData.revenue || ""}
                onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
                placeholder="Enter total revenue"
              />
            </div>
            <div>
              <Label htmlFor="expenses">Total Expenses (AED)</Label>
              <Input
                id="expenses"
                type="number"
                value={formData.expenses || ""}
                onChange={(e) => setFormData({ ...formData, expenses: Number(e.target.value) })}
                placeholder="Enter total expenses"
              />
            </div>
            <Button onClick={handleGenerateReport} className="w-full">
              Generate Report
            </Button>
          </div>
        </Card>

        {/* Report Display */}
        {reportData && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Financial Report</h2>
            <div className="space-y-4">
              <div className="text-lg font-medium">Period: {reportData.period}</div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span>{formatCurrency(reportData.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Expenses:</span>
                  <span>{formatCurrency(reportData.expenses)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Gross Profit:</span>
                  <span className={reportData.profit >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(reportData.profit)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t pt-2">
                <div className="flex justify-between">
                  <span>VAT (5%):</span>
                  <span>{formatCurrency(reportData.vat)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Corporate Tax (9%):</span>
                  <span>{formatCurrency(reportData.corporateTax)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Net Profit:</span>
                  <span className={reportData.netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(reportData.netProfit)}
                  </span>
                </div>
              </div>

              {/* Tax Details */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tax Details</h3>
                <div className="text-sm space-y-2">
                  <p>
                    Corporate tax is calculated at 9% on taxable income exceeding AED 375,000.
                  </p>
                  {reportData.corporateTax === 0 ? (
                    <p className="text-green-600">
                      No corporate tax applicable as taxable income is below AED 375,000 threshold.
                    </p>
                  ) : (
                    <p>
                      Taxable amount above threshold: {formatCurrency(Math.max(0, reportData.profit - 375000))}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Tax Calculator */}
      <Card className="mt-8 p-6">
        <h2 className="text-xl font-semibold mb-4">UAE Corporate Tax Calculator</h2>
        <p className="text-sm text-gray-600 mb-4">
          Calculate corporate tax based on income exceeding AED 375,000 threshold.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="calc-income">Total Income (AED)</Label>
            <Input
              id="calc-income"
              type="number"
              value={formData.revenue || ""}
              onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
              placeholder="Enter total income"
            />
          </div>
          <div>
            <Label htmlFor="calc-expenses">Total Expenses (AED)</Label>
            <Input
              id="calc-expenses"
              type="number"
              value={formData.expenses || ""}
              onChange={(e) => setFormData({ ...formData, expenses: Number(e.target.value) })}
              placeholder="Enter total expenses"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={() => {
                const tax = calculateUAECorporateTax(formData.revenue, formData.expenses)
                alert(`Estimated Corporate Tax: ${formatCurrency(tax)}`)
              }}
              className="w-full"
            >
              Calculate Tax
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
