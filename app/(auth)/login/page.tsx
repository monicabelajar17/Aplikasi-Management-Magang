"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Menggunakan User, Mail, Lock, dan Eye dari lucide-react
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    // 1. Background menggunakan warna biru pucat (light blue/lavender tint)
    <div className="min-h-screen flex items-center justify-center bg-[#E6EFFF] p-4 font-sans">
      
      {/* 2. Card dengan shadow halus dan border transparan untuk efek glass */}
      <Card className="w-full max-w-[450px] border-none shadow-2xl bg-white/80 backdrop-blur-sm p-6 rounded-2xl">
        
        <CardHeader className="flex flex-col items-center pb-2">
          {/* 3. Icon Avatar bulat biru dongker */}
          <div className="w-20 h-20 bg-[#0A2659] rounded-full flex items-center justify-center mb-4 shadow-lg">
            <User className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-[#0A2659] text-3xl font-extrabold tracking-tight">
            Welcome Back
          </CardTitle>
          <p className="text-slate-500 text-sm">Sign in to your account</p>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Input Email dengan Icon di dalam */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#0A2659] font-semibold ml-1">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className="pl-10 py-6 border-slate-200 rounded-xl focus-visible:ring-[#0A2659]"
              />
            </div>
          </div>

          {/* Input Password dengan Icon Mata (Toggle Visibility) */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#0A2659] font-semibold ml-1">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                className="pl-10 py-6 border-slate-200 rounded-xl focus-visible:ring-[#0A2659]"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* 4. Tombol Sign In Biru Dongker */}
          <Button className="w-full bg-[#0A2659] hover:bg-[#061a3d] py-6 text-lg font-bold rounded-xl shadow-md transition-all">
            Sign In
          </Button>
        </CardContent>

        <div className="text-center pb-6">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <a href="#" className="text-blue-600 font-semibold hover:underline">Sign up</a>
          </p>
        </div>
      </Card>
    </div>
  )
}