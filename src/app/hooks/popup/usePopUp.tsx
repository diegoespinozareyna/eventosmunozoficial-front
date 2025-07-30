import { FormComprarTicket } from "@/app/components/Forms/FormComprarTicket"
import { changeDecimales } from "@/app/functions/changeDecimales"
import { Button } from "@mui/material"
import { X } from "lucide-react"
import { useState } from "react"

export const usePopUp = () => {
    const [openPopup, setOpenPopup] = useState<boolean>(false)

    const PopUp = ({ onSubmit, handleSubmit, control, apiCall, loading, error, getValues, setValue, setOpen }: any) => {
        return (
            <>
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50" />
                <div className="absolute flex flex-col bg-white pb-4 z-50 shadow-xl rounded-lg modal-slide-up justify-start">
                    <div className="border-1 w-full text-center mb-3 cursor-pointer bg-blue-50 flex justify-center items-center rounded-t-lg" onClick={() => setOpenPopup(false)}><X color="blue" /></div>
                    <div className="flex flex-col gap-2 bg-[rgba(255,255,255,0.8)] rounded-lg p-3 px-3 mt-0 w-[350px] mx-2">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-3">
                                <div className="uppercase text-center text-base font-bold text-black">
                                    {"Datos Usuario"}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <FormComprarTicket {...{ getValues, setValue, handleSubmit, control, apiCall, loading, error }} />
                                </div>
                                <div className="flex flex-row gap-3 w-full">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="submit"
                                        className="w-full"
                                    >
                                        Comprar Ticket
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
    return {
        openPopup,
        setOpenPopup,
        PopUp,
    }
}