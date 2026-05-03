export const dashboard= async(req,res) =>{
    try{
        res.status(200).json({
      message:"Dashboard page",
      user: req.user
    })


    }catch(err){
         res.status(500).json({ message: 'Server error', error: error.message })
    }
}