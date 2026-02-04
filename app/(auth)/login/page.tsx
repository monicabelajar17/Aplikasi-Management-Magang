"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { loginAction } from "./actions" // Pastikan path ke actions.ts benar

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await loginAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // Jika sukses, redirect diatur oleh server action
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6EFFF] p-4 font-sans">
      <Card className="w-full max-w-[450px] border-none shadow-2xl bg-white/80 backdrop-blur-sm p-6 rounded-2xl">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="w-20 h-20 bg-[#0A2659] rounded-full flex items-center justify-center mb-4 shadow-lg">
            <User className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-[#0A2659] text-3xl font-extrabold tracking-tight">
            Welcome Back
          </CardTitle>
          <p className="text-slate-500 text-sm">Sign in to your account</p>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Tambahkan tag form dengan action */}
          <form action={handleSubmit} className="space-y-6">
            
            {/* Tampilkan error kalau ada */}
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0A2659] font-semibold ml-1">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input 
                  id="email" 
                  name="email" // WAJIB ADA
                  type="email" 
                  placeholder="Enter your email" 
                  required
                  className="pl-10 py-6 border-slate-200 rounded-xl focus-visible:ring-[#0A2659]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#0A2659] font-semibold ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input 
  id="password" 
  name="password"
  type={showPassword ? "text" : "password"} 
  placeholder="Enter your password"
  required
  className="pl-10 pr-12 py-6 border-slate-200 rounded-xl focus-visible:ring-[#0A2659]"
/>

                
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0A2659] hover:bg-[#061a3d] py-6 text-lg font-bold rounded-xl shadow-md transition-all"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}