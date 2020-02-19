exports.getItem = (req, res, next) => {
  res.json({
    Equipment: [
      {
        _id: "01",
        title: "equipment1",
        description: "This is an electronics workbench",
        location: "Makindye",
        imageURL:
          "https://images.unsplash.com/photo-1454976635780-7d49710daa1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        owner: {
          name: "Wycliff"
        }
      }
    ]
  });
};

exports.addItem = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({ 
    message: "Item added successfully!",
    Item: {
      _id: new Date().toISOString(),
      title: title,
      description: description,
      location: location,
      imageURL: imageURL,
      owner: { name: "Wycliff" }
    }
  });
};
