"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface BackupData {
  customers: unknown[]
  projects: unknown[]
  invoices: unknown[]
  quotations: unknown[]
  materials: unknown[]
  labor: unknown[]
  timestamp: string
  version: string
}

export function BackupManager() {
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  const createBackup = () => {
    setIsBackingUp(true)
    
    try {
      // Collect all data from localStorage
      const backupData: BackupData = {
        customers: JSON.parse(localStorage.getItem("kashmir_customers") || "[]"),
        projects: JSON.parse(localStorage.getItem("kashmir_projects") || "[]"),
        invoices: JSON.parse(localStorage.getItem("kashmir_invoices") || "[]"),
        quotations: JSON.parse(localStorage.getItem("kashmir_quotations") || "[]"),
        materials: JSON.parse(localStorage.getItem("kashmir_materials") || "[]"),
        labor: JSON.parse(localStorage.getItem("kashmir_labor") || "[]"),
        timestamp: new Date().toISOString(),
        version: "1.0.0"
      }

      // Create downloadable file
      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement("a")
      link.href = url
      link.download = `kashmir-carpentry-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      alert("Backup created successfully!")
    } catch (error) {
      alert("Error creating backup: " + error)
    } finally {
      setIsBackingUp(false)
    }
  }

  const restoreBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsRestoring(true)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const backupData: BackupData = JSON.parse(e.target?.result as string)
        
        // Validate backup data structure
        if (!backupData.timestamp || !backupData.version) {
          throw new Error("Invalid backup file format")
        }

        // Restore data to localStorage
        localStorage.setItem("kashmir_customers", JSON.stringify(backupData.customers))
        localStorage.setItem("kashmir_projects", JSON.stringify(backupData.projects))
        localStorage.setItem("kashmir_invoices", JSON.stringify(backupData.invoices))
        localStorage.setItem("kashmir_quotations", JSON.stringify(backupData.quotations))
        localStorage.setItem("kashmir_materials", JSON.stringify(backupData.materials))
        localStorage.setItem("kashmir_labor", JSON.stringify(backupData.labor))
        
        alert(`Backup restored successfully! Data from ${new Date(backupData.timestamp).toLocaleString()}`)
        
        // Refresh the page to load restored data
        window.location.reload()
      } catch (error) {
        alert("Error restoring backup: " + error)
      } finally {
        setIsRestoring(false)
      }
    }
    
    reader.readAsText(file)
  }

  const exportToCSV = (dataType: string) => {
    try {
      const data = JSON.parse(localStorage.getItem(`kashmir_${dataType}`) || "[]")
      
      if (data.length === 0) {
        alert(`No ${dataType} data to export`)
        return
      }

  // Convert to CSV
  const headers = Object.keys(data[0]).join(",")
  const rows = data.map((item: unknown) => 
    Object.values(item as Record<string, unknown>).map(value => 
      typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
    ).join(",")
  ).join("\n")
      
      const csvContent = headers + "\n" + rows
      
      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${dataType}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      alert(`${dataType} data exported to CSV successfully!`)
    } catch (error) {
      alert(`Error exporting ${dataType}: ` + error)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Data Backup & Export</h2>
      
      <div className="space-y-4">
        {/* Full Backup */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Full System Backup</h3>
          <div className="flex gap-4">
            <Button 
              onClick={createBackup}
              disabled={isBackingUp}
            >
              {isBackingUp ? "Creating Backup..." : "Create Backup"}
            </Button>
            
            <div>
              <Label htmlFor="restore-file" className="cursor-pointer">
                <Button 
                  variant="outline"
                  disabled={isRestoring}
                  asChild
                >
                  <span>{isRestoring ? "Restoring..." : "Restore Backup"}</span>
                </Button>
              </Label>
              <input
                id="restore-file"
                type="file"
                accept=".json"
                onChange={restoreBackup}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* CSV Exports */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Export to CSV</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportToCSV("customers")}
            >
              Customers
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportToCSV("projects")}
            >
              Projects
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportToCSV("invoices")}
            >
              Invoices
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportToCSV("materials")}
            >
              Materials
            </Button>
          </div>
        </div>

        {/* Auto Backup Settings */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Auto Backup</h3>
          <p className="text-sm text-gray-600 mb-2">
            Automatic backups are created daily and stored locally in your browser.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const lastBackup = localStorage.getItem("kashmir_last_backup")
              if (lastBackup) {
                alert(`Last automatic backup: ${new Date(lastBackup).toLocaleString()}`)
              } else {
                alert("No automatic backup found")
              }
            }}
          >
            Check Last Auto Backup
          </Button>
        </div>
      </div>
    </Card>
  )
}
