"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock } from "lucide-react"
import { loginAction } from "./actions"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

export default function LoginPage() {
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
  }

  // ======================
  // LOGIN GOOGLE
  // ======================
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError("Gagal login dengan Google")
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6EFFF] p-4 font-sans">
      <Card className="w-full max-w-[450px] border-none shadow-2xl bg-white/80 backdrop-blur-sm p-6 rounded-2xl">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="w-20 h-20 bg-[#0A2659] rounded-full flex items-center justify-center mb-4 shadow-lg">
            <User className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-[#0A2659] text-3xl font-extrabold">
            Welcome Back
          </CardTitle>
          <p className="text-slate-500 text-sm">Sign in to your account</p>
        </CardHeader>

        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[#0A2659] font-semibold ml-1">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="pl-10 py-6 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#0A2659] font-semibold ml-1">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="pl-10 py-6 rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A2659] hover:bg-[#061a3d] py-6 text-lg font-bold rounded-xl"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            {/* ===== DIVIDER ===== */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">
                OR
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* ===== GOOGLE LOGIN ===== */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full py-6 rounded-xl font-bold flex items-center justify-center gap-3"
            >
              {/* GOOGLE ICON */}
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2c-1.8 1.3-4.1 2.1-7.3 2.1-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.5 39.7 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.5-6.1 7.1l6.3 5.2C39.5 36.6 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>
              Sign in with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
