export interface History {
    "id": String,
    "user_id": String,
    "agendamiento_id": String,
    "icon": String,
    "created_at": String,
    "usuario": {
        "id": String,
        "usuario": String,
        "person_id": String,
        "image":String,
        "person": {
            "id": String,
            "identifier": String,
            "full_name": String ,
            "first_surname": String,
            "first_name": String
        }
    }
}