import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  emailInputRef,
  handleSubmit,
  isLoading,
  loadingMessage,
}) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-center bg-background"
    >
      <div className="flex items-center gap-1 p-2 rounded-md mb-8">
        <img src="" alt="south-pole Logo" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-lg mb-10">description </p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <motion.input
              ref={emailInputRef}
              type="text"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>

            <div className="relative">
              <motion.input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all"
                whileFocus={{ scale: 1.02 }}
              />

              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[12px] text-muted-foreground hover:text-primary p-1"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-end"
          >
            <button
              type="button"
              onClick={() => navigate("forgot-password")}
              className="text-sm text-primary hover:underline transition-colors"
            >
              Forgot password?
            </button>
          </motion.div>

          <Button className="w-full py-3" type="submit" disabled={isLoading}>
            {isLoading ? (
              <motion.span
                key={loadingMessage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {loadingMessage}
              </motion.span>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
