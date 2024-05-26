import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import Image from "next/image";
import React from 'react'
import Inch from '../../assets/inch.png'

const Calculator = () => {

    const calculatorIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
    </svg>

    const initialComparison = {
        initial: '',
        desired: ''
    }
    const [calculator, setCalculator] = useState(false)
    const [comparison, setComparison] = useState(initialComparison)
    const [difference, setDifference] = useState(0)
    const [percentage, setPercentage] = useState(0)


    const handleChange = (e) => {
        const {name, value} = e.target;
        setComparison(prevState => ({
            ...prevState,
            [name]: value
        }));

    }

    useEffect(() => {
        setDifference((Math.abs(parseFloat(comparison.initial) - parseFloat(comparison.desired)) * 12).toString().slice(0,5));
    }, [comparison]);
    
    useEffect(() => {
        const newDifference = (Math.abs(parseFloat(comparison.initial) - parseFloat(comparison.desired)) * 12).toFixed(2);
        const decimalPart = newDifference.toString().split('.')[1];
        const lastTwoDecimalNumbers = decimalPart ? decimalPart.slice(-2) : 0;
        setPercentage(parseInt(lastTwoDecimalNumbers));
    }, [comparison]);
    
    
    
  return (
    <div>
        <Modal show={calculator} onHide={() => setCalculator(!calculator)} >
            <Modal.Header id="modal" className="w-full text-center font-bold" closeButton={true}>Elevation Calculator</Modal.Header>
            <Modal.Body id="modal">
                <div className="flex grid grid-cols-2 items-center gap-3">
                    <label>Initial Elevation:</label>
                    <input name="initial" className="input" type="number" onChange={handleChange}/>
                    <label>Desired Elevation:</label>
                    <input name="desired" className="input" type="number" onChange={handleChange}/>
                </div>
                <div className="flex grid grid-cols-2 items-center justify-center gap-3">
                    <p className="mt-3">Total Difference:</p>
                    <input className="input bg-slate-400" disabled value={difference}/>
                    <p>Inches Difference: </p>
                    <p className="font-extrabold">{ initialComparison.initial && initialComparison.desired ? difference.toString().slice(0, 2) : ''} Inches</p>
                    <p>And </p>
                </div>
                <div className="relative w-[350px] mx-auto m-5">
                    <Image alt="inchimg" src={Inch} width={350}>
                    </Image>
                    <div className={`absolute w-[14px] h-[14px] rounded bg-[#ff0019] bottom-[65%]`} style={{ left: `${(percentage - 2).toString()}%` }}></div>
                </div>
            </Modal.Body>
        </Modal>
        <button className="w-1 ml-3" onClick={() => setCalculator(!calculator)}>{calculatorIcon}</button>
    </div>
  )
}

export default Calculator