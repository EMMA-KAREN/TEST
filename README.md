# TEST
1.the add reflags is working :not done the styling
2.fetch all reflag for user by id  working 
3.edit and delete button have not  done 
4.fetching all redflag for admin and update status not yet :


## have send together with backend i did some changes in the redflag.py":
   1.in the fetch red_flag_list.append({
            "id": red_flag.id,
            "title": red_flag.title,
            "description": red_flag.description,
            "image": red_flag.image,
            "video": red_flag.video,
            "location": red_flag.location,
            "status": red_flag.status,
            "created_at": red_flag.created_at,
            "user_id": red_flag.user_id,  # Make sure user_id is included
            "user": {
                "id": red_flag.users.id,
                "First Name": red_flag.users.first_name,
                "Last Name": red_flag.users.last_name,
                "Email": red_flag.users.email,
                "Phone": red_flag.users.phone,
                "Profile Picture": red_flag.users.profile_picture
            }
        }) so that it can fetch user by id 

## app.py :app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  -----to allow url with large legth expecially chrome image .url

 ## class Red_Flags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(512), nullable=True)
    video = db.Column(db.String(512), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    location = db.Column(db.String(255))
    status = db.Column(db.String(50), default='active')  # Ensure this line is present
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

this table i added status column but a user when filling the table he can  not select any status it goes as default so that the user can update and the status changes accordingly 

tables i was working with :redflag.jsx ,redflagcontext.jsx and redflag.py 

have written some code for intervention but not yet tested and not sure if there working 




