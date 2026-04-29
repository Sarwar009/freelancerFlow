"use client"
import { motion } from "framer-motion"

export default function DashboardCard({title,value}:{title:string,value:string}){

  return(

    <motion.div
      whileHover={{ scale:1.05 }}
      className="bg-white shadow-md rounded-xl p-6"
    >

      <h3 className="text-gray-500 mb-2">
        {title}
      </h3>

      <p className="text-2xl font-bold">
        {value}
      </p>

    </motion.div>

  )
}