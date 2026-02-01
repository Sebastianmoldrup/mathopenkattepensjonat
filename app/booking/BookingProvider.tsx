"use client";

import { createContext, useState, useReducer } from "react";

// Types
interface BookingProviderType {
}

interface User {
  email: string;
  name: string;
  phone: string;
  address: string;
  emergencyContact: string;
  cats: Cat[];
}
  
interface BookingState {
  currentStep: number;
  totalSteps: number;
  user: User | null;
  selectedCats: Cat[];
  pricing: number | null;
  specialInstructions: string;
  isLoading: boolean;
  error: null | string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  selectedTimeSlot: {
    checkIn: null | string;
    checkOut: null | string;
    isCustom: boolean;
  }
}

interface BookingAction {
  type: string;  
  payload: BookingState;
}

interface Cat {}

//  Initial state
const TOTAL_STEPS = 5; // 1. Logg inn, 2. Velg katter, 3. Velg dato, 4. Veld tid, 5. Pris oppsummering
const INITIAL_STATE: BookingState = {
  currentStep: 0,
  totalSteps: TOTAL_STEPS,
  user: null,
  selectedCats: [],
  pricing: null,
  specialInstructions: "",
  isLoading: false,
  error: null,
  dateRange: {
    from: null,
    to: null
  },
  selectedTimeSlot: {
    checkIn: null,
    checkOut: null,
    isCustom: false,
  },
};

// Provider
const BookingProviderContext = createContext<>({
});

// Reducer
function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
      }
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep - 1, state.totalSteps - 1),
      }
    default:
      return state;
  }
}

const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(bookingReducer, {})

  return (
    <BookingProviderContext
      value={{
      }}
    >
      {children}
    </BookingProviderContext>
  );
};

export default BookingProvider;
export { BookingProviderContext };




// ============================================================================
// INITIAL STATE
// ============================================================================

// const TOTAL_STEPS = 5; // 0: Logg inn, 1: Velg katter, 2: Velg datoer, 3: Velg tid, 4: Oppsummering
//
// const initialState: BookingState = {
//   currentStep: 0,
//   totalSteps: TOTAL_STEPS,
//   user: null,
//   selectedCats: [],
//   dateRange: {
//     from: null,
//     to: null,
//   },
//   selectedTimeSlot: {
//     checkin: null,
//     checkout: null,
//     isCustom: false,
//   },
//   pricing: null,
//   additionalServices: [],
//   specialInstructions: "",
//   isLoading: false,
//   error: null,
// };

// ============================================================================
// REDUCER
// ============================================================================

// function bookingReducer(
//   state: BookingState,
//   action: BookingAction,
// ): BookingState {
//   switch (action.type) {
//     // Stegnavigasjon med grensekontroll
//     case "NEXT_STEP":
//       return {
//         ...state,
//         currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
//         error: null,
//       };
//
//     case "PREV_STEP":
//       return {
//         ...state,
//         currentStep: Math.max(state.currentStep - 1, 0),
//         error: null,
//       };
//
//     case "GO_TO_STEP":
//       return {
//         ...state,
//         currentStep: Math.max(
//           0,
//           Math.min(action.payload, state.totalSteps - 1),
//         ),
//         error: null,
//       };
//
//     case "RESET_STEPS":
//       return {
//         ...state,
//         currentStep: state.user ? 1 : 0,
//       };
//
//     // Brukerhåndtering
//     case "SET_USER":
//       return {
//         ...state,
//         user: action.payload,
//         currentStep: action.payload ? 1 : 0,
//       };
//
//     // Kattehåndtering
//     case "SET_SELECTED_CATS":
//       return {
//         ...state,
//         selectedCats: action.payload,
//       };
//
//     case "ADD_CAT":
//       if (state.selectedCats.some((cat) => cat.id === action.payload.id)) {
//         return state;
//       }
//       return {
//         ...state,
//         selectedCats: [...state.selectedCats, action.payload],
//       };
//
//     case "REMOVE_CAT":
//       return {
//         ...state,
//         selectedCats: state.selectedCats.filter(
//           (cat) => cat.id !== action.payload,
//         ),
//       };
//
//     // Dato og tid
//     case "SET_DATE_RANGE":
//       return {
//         ...state,
//         dateRange: action.payload,
//         pricing: null,
//       };
//
//     case "SET_TIME_SLOT":
//       return {
//         ...state,
//         selectedTimeSlot: action.payload,
//       };
//
//     // Prising
//     case "SET_PRICING":
//       return {
//         ...state,
//         pricing: action.payload,
//       };
//
//     // Tilleggsalternativer
//     case "SET_ADDITIONAL_SERVICES":
//       return {
//         ...state,
//         additionalServices: action.payload,
//       };
//
//     case "SET_SPECIAL_INSTRUCTIONS":
//       return {
//         ...state,
//         specialInstructions: action.payload,
//       };
//
//     // UI-tilstand
//     case "SET_LOADING":
//       return {
//         ...state,
//         isLoading: action.payload,
//       };
//
//     case "SET_ERROR":
//       return {
//         ...state,
//         error: action.payload,
//         isLoading: false,
//       };
//
//     // Tilbakestill
//     case "RESET_BOOKING":
//       return {
//         ...initialState,
//         user: state.user,
//         currentStep: state.user ? 1 : 0,
//       };
//
//     default:
//       return state;
//   }
// }
//
// ============================================================================
// CONTEXT
// ============================================================================

// interface BookingContextType {
//   state: BookingState;
//   dispatch: React.Dispatch<BookingAction>;
//
//   // Hjelpemetoder
//   nextStep: () => void;
//   prevStep: () => void;
//   goToStep: (step: number) => void;
//   canProceed: () => boolean;
//   resetBooking: () => void;
//
//   // Valideringshjelpere
//   isStepValid: (step: number) => boolean;
//   getStepErrors: (step: number) => string[];
// }
//
// const BookingContext = createContext<BookingContextType | undefined>(undefined);
//
// ============================================================================
// PROVIDER
// ============================================================================

// interface BookingProviderProps {
//   children: ReactNode;
//   user?: BookingUser | null;
// }
//
// export default function BookingProvider({
//   children,
//   user = null,
// }: BookingProviderProps) {
//   const [state, dispatch] = useReducer(bookingReducer, {
//     ...initialState,
//     user,
//     currentStep: user ? 1 : 0,
//   });
//
  // ============================================================================
  // HJELPEMETODER
  // ============================================================================

  // const nextStep = useCallback(() => {
  //   dispatch({ type: "NEXT_STEP" });
  // }, []);
  //
  // const prevStep = useCallback(() => {
  //   dispatch({ type: "PREV_STEP" });
  // }, []);
  //
  // const goToStep = useCallback((step: number) => {
  //   dispatch({ type: "GO_TO_STEP", payload: step });
  // }, []);
  //
  // const resetBooking = useCallback(() => {
  //   dispatch({ type: "RESET_BOOKING" });
  // }, []);
  //
  // ============================================================================
  // VALIDERING
  // ============================================================================

  // const isStepValid = useCallback(
  //   (step: number): boolean => {
  //     switch (step) {
  //       case 0: // Innloggingssteg
  //         return state.user !== null;
  //
  //       case 1: // Kattevalg
  //         return state.selectedCats.length > 0;
  //
  //       case 2: // Datovalg
  //         return (
  //           state.dateRange.from !== null &&
  //           state.dateRange.to !== null &&
  //           state.dateRange.from <= state.dateRange.to
  //         );
  //
  //       case 3: // Tidsvalg
  //         return (
  //           state.selectedTimeSlot !== null &&
  //           state.selectedTimeSlot.checkin !== null &&
  //           state.selectedTimeSlot.checkout !== null
  //         );
  //
  //       case 4: // Oppsummering
  //         return state.pricing !== null;
  //
  //       default:
  //         return false;
  //     }
  //   },
  //   [
  //     state.user,
  //     state.selectedCats,
  //     state.dateRange,
  //     state.selectedTimeSlot,
  //     state.pricing,
  //   ],
  // );
  //
  // const getStepErrors = useCallback(
  //   (step: number): string[] => {
  //     const errors: string[] = [];
  //
  //     switch (step) {
  //       case 0:
  //         if (!state.user) {
  //           errors.push("Vennligst logg inn for å fortsette");
  //         }
  //         break;
  //
  //       case 1:
  //         if (state.selectedCats.length === 0) {
  //           errors.push("Vennligst velg minst én katt");
  //         }
  //         break;
  //
  //       case 2:
  //         if (!state.dateRange.from) {
  //           errors.push("Vennligst velg en startdato");
  //         }
  //         if (!state.dateRange.to) {
  //           errors.push("Vennligst velg en sluttdato");
  //         }
  //         if (
  //           state.dateRange.from &&
  //           state.dateRange.to &&
  //           state.dateRange.from > state.dateRange.to
  //         ) {
  //           errors.push("Sluttdato må være etter startdato");
  //         }
  //         break;
  //
  //       case 3:
  //         if (!state.selectedTimeSlot?.checkin) {
  //           errors.push("Vennligst velg leveringstidspunkt");
  //         }
  //         if (!state.selectedTimeSlot?.checkout) {
  //           errors.push("Vennligst velg hentetidspunkt");
  //         }
  //         break;
  //
  //       case 4:
  //         if (!state.pricing) {
  //           errors.push("Prisinformasjon mangler");
  //         }
  //         break;
  //     }
  //
  //     return errors;
  //   },
  //   [state],
  // );
  //
  // const canProceed = useCallback((): boolean => {
  //   return isStepValid(state.currentStep);
  // }, [state.currentStep, isStepValid]);
  //
  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================
//
//   const contextValue = useMemo<BookingContextType>(
//     () => ({
//       state,
//       dispatch,
//       nextStep,
//       prevStep,
//       goToStep,
//       canProceed,
//       resetBooking,
//       isStepValid,
//       getStepErrors,
//     }),
//     [
//       state,
//       nextStep,
//       prevStep,
//       goToStep,
//       canProceed,
//       resetBooking,
//       isStepValid,
//       getStepErrors,
//     ],
//   );
//
//   return (
//     <BookingContext.Provider value={contextValue}>
//       {children}
//     </BookingContext.Provider>
//   );
// }
//
// ============================================================================
// HOOK
// ============================================================================
//
// export function useBooking() {
//   const context = useContext(BookingContext);
//   if (context === undefined) {
//     throw new Error("useBooking må brukes innenfor BookingProvider");
//   }
//   return context;
// }
//
// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================
//
// export function useBookingState() {
//   const { state } = useBooking();
//   return state;
// }
//
// export function useBookingNavigation() {
//   const { nextStep, prevStep, goToStep, canProceed } = useBooking();
//   return { nextStep, prevStep, goToStep, canProceed };
// }
//
// export function useBookingValidation() {
//   const { isStepValid, getStepErrors } = useBooking();
//   return { isStepValid, getStepErrors };
// }
