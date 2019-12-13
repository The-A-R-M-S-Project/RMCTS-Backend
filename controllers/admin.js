exports.getItem = (req,res,next) => {
        res.json({
            Equipment: [{_id: '01', name: "This is an electronics workbench"}]
        })
    }
    
exports.addItem = (req,res,next)=>{
    const title = req.body.title;
    const content = req.body.content;

    res.status(201).json({
        message: "Item added successfully!",
        Item: {id: new Date.toISOString(), title: title, content:content}
    })

    }
