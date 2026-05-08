'use client'

import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  key: string
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentIndex: number
}

export function StepIndicator({ steps, currentIndex }: StepIndicatorProps) {
  const visibleSteps = steps.slice(0, currentIndex + 2)

  return (
    <nav aria-label="Bookingsteg" className="px-3 sm:px-0">
      <ol className="flex w-full items-center">
        {visibleSteps.map((step, i) => {
          const isCompleted = i < currentIndex
          const isCurrent = i === currentIndex
          const isNew = i === currentIndex + 1

          return (
            <li
              key={step.key}
              className="flex min-w-0 flex-1 items-center last:flex-none"
              style={
                isNew
                  ? {
                      animation:
                        'step-pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                    }
                  : undefined
              }
            >
              <div className="flex shrink-0 flex-col items-center gap-1">
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-semibold sm:h-8 sm:w-8 sm:text-xs',
                    'transition-colors duration-300',
                    isCompleted
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isCurrent
                        ? 'border-primary bg-background text-primary'
                        : 'border-muted-foreground/30 bg-background text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    'whitespace-nowrap text-center text-[10px] font-medium leading-tight sm:text-xs',
                    'transition-colors duration-300',
                    isCurrent ? 'text-primary' : 'text-muted-foreground',
                    !isCurrent && 'invisible sm:visible'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {i < Math.min(currentIndex + 1, visibleSteps.length - 1) && (
                <div
                  className="mx-1 mb-4 h-0.5 flex-1 sm:mx-2"
                  style={{
                    background:
                      i < currentIndex
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--muted-foreground) / 0.2)',
                    transition: 'background 0.4s ease',
                  }}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
