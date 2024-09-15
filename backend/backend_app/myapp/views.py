from django.http import JsonResponse
from rest_framework import viewsets
from django.views.decorators.csrf import csrf_exempt
import json
import re
from pymongo import MongoClient
import uuid
from bson import ObjectId
from django.core.mail import send_mail
client = MongoClient("mongodb://localhost:27017/")

db = client.my_database
customer_collection = db.customers
organization_collection = db.organization
items_collection=db.items
# Add this to your existing code to create a MongoDB collection
contact_collection = db.contact
sales_collection=db.sales


@csrf_exempt
def sign_in(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data["email"]
        password = data["password"]

        user = customer_collection.find_one({"email": email})
        if user is not None:
            if password != user["password"]:
                return JsonResponse({"notMatch": "Password is invalid"})
        else:
            return JsonResponse({"notMatch": "No such user with this email found"})

        return JsonResponse({
            "message": f"Welcome {email}",
            "user_id": user["user_id"],
            "role": user["role"],  # Assuming you have a 'role' field in the user collection
            "success": True,
        }, status=200)


@csrf_exempt
def sign_up(request):
    if request.method == "POST":

        data = json.loads(request.body)
        email = data["email"]
        password = data["password"]
        cpass = data["cpassword"]
        role=data["role"]
        re_email = r"^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$"

        if not re.match(re_email, email):
            return JsonResponse(
                {"email": "Invalid Email , please enter a valid email address"}
            )

        re_password = r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#?&])[A-Za-z\d@$!%*#?&]{8,}$"

        if not re.match(re_password, password):
            return JsonResponse(
                {
                    "password": "Invalid Password, please use a password of 8 or more characters having at least 1 symbol, 1 capital letter & 1 number"
                }
            )

        if password != cpass:
            return JsonResponse({"cpassword": "Password does not match"})

        user_id = str(uuid.uuid4())

        data["user_id"] = user_id

        user = customer_collection.find_one({"email": email})

        if user:
            return JsonResponse(
                {"accountFound": "An account with this email already exists"}
            )

        else:
            customer_collection.insert_one(data)

            return JsonResponse(
                {
                    "message": f"Welcome {email}",
                    "user_id": data["user_id"],
                    "success": True,
                },
                status=200,
            )


@csrf_exempt
def get_customer_data(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")
        user = customer_collection.find_one({"user_id": user_id})
        if user:
            user["_id"] = str(user["_id"])
            return JsonResponse({"user": user})
        return JsonResponse({"message": "User not found"}, status=404)


@csrf_exempt
def get_organization_data(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")

        org = organization_collection.find_one({"org_user_id": user_id})
        if org:
            org["_id"] = str(org["_id"])
            return JsonResponse({"org": org, "success": True})
        return JsonResponse({"message": "Org not found"})


@csrf_exempt
def add_organization(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            organization_collection.insert_one(data)
            return JsonResponse(
                {
                    "message": "Organization added successfully",
                    "user_id": data["org_user_id"],
                    "success": True,
                },
                status=201,
            )
        except Exception as e:
            return JsonResponse(
                {"message": "An error occurred", "error": str(e)}, status=500
            )


@csrf_exempt
def update_organization(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            org_id = data.get("org_id")
            updated_data = {
                "orgName": data.get("orgName"),
                "industry": data.get("industry"),
                "startDate": data.get("startDate"),
                "location": data.get("location"),
                "currency": data.get("currency"),
                # Add more fields as necessary
            }

            organization_collection.update_one(
                {"_id": ObjectId(org_id)}, {"$set": updated_data}
            )
            return JsonResponse(
                {"message": "Organization updated successfully", "success": True},
                status=200,
            )
        except Exception as e:
            return JsonResponse(
                {"message": "An error occurred", "error": str(e)}, status=500
            )


@csrf_exempt
def get_profile(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")
        user = customer_collection.find_one({"user_id": user_id})
        del user["_id"]
        if user:
            return JsonResponse({"user": user, "success": True}, status=200)
        return JsonResponse({"message": "User not found"}, status=404)


@csrf_exempt
def update_profile(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")
        updated_data = {
            "fname": data.get("fname"),
            "lname": data.get("lname"),
            "email": data.get("email"),
        }
        old_password = data.get("old_password")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")

        user = customer_collection.find_one({"user_id": user_id})

        if old_password or new_password or confirm_password:
            if not user:
                return JsonResponse({"message": "User not found"}, status=404)

            if old_password != user.get("password"):
                return JsonResponse(
                    {"message": "Old password is incorrect"}, status=400
                )

            if new_password != confirm_password:
                return JsonResponse(
                    {"message": "New passwords do not match"}, status=400
                )
            # Regular expression for password validation
            re_password = r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#?&])[A-Za-z\d@$!%*#?&]{8,}$"
            if not re.match(re_password, new_password):
                return JsonResponse(
                    {
                        "message": "Invalid New Password, please use a password of 8 or more characters having at least 1 symbol, 1 capital letter & 1 number"
                    },
                )
            
            updated_data["password"] = new_password
            updated_data["cpassword"] = confirm_password
        result = customer_collection.update_one(
            {"user_id": user_id}, {"$set": updated_data}
        )

        if result.matched_count == 0:
            return JsonResponse(
                {"message": "User not found or no changes made"}
            )

        return JsonResponse(
            {"message": "Profile updated successfully", "success": True}, status=200
        )


@csrf_exempt
def contact_us(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("fullName")
            email = data.get("email")
            message = data.get("message")

            # Perform some basic validation (optional)
            if not name or not email or not message:
                return JsonResponse({"error": "All fields are required"}, status=400)

            # Save the contact message to MongoDB with reply status set to false
            contact_id = contact_collection.insert_one({
                "fullName": name,
                "email": email,
                "message": message,
                "reply_sent": False  # Initially, no reply has been sent
            }).inserted_id

            return JsonResponse({"message": "Thank you for contacting us!", "contact_id": str(contact_id)}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def get_contact_queries(request):
    if request.method == "GET":
        try:
            # Fetch all the contact queries from MongoDB
            queries = list(contact_collection.find({}))
            
            # Convert ObjectId to string for JSON serialization
            for query in queries:
                query["_id"] = str(query["_id"])
                
            return JsonResponse({"queries": queries, "success": True}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def send_email(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            print(email)
            message = data.get("message")
            contact_id = data.get("contact_id")  # The ID of the contact message being replied to

            if not email or not message or not contact_id:
                return JsonResponse({"error": "Missing email, message, or contact_id"}, status=400)
             # Format the email message
            formatted_message = (
                f"Dear {data.get('fullName', 'Customer')},\n\n"
                f"Thank you for contacting us.\n\n"
               
              
                f"{message}\n\n"
                f"Best regards,\nInventoryIQ"
            )

            # Sending the email (adjust the subject, from email, and your SMTP settings)
            send_mail(
                subject='Reply to Your Contact Us Query',
                message=formatted_message,
                from_email='mansipatel9898.mp@gmail.com',  # Replace with your own email
                recipient_list=[email],
                fail_silently=False,
            )

            # Update the contact document to include the reply and indicate that a reply has been sent
            result = contact_collection.update_one(
                {"_id": ObjectId(contact_id)},
                {"$set": {"reply": message, "reply_sent": True}}
            )

            if result.matched_count > 0:
                return JsonResponse({"message": "Reply sent successfully", "success": True}, status=200)
            else:
                return JsonResponse({"error": "Contact not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def add_item(request):
    if request.method == "POST":

        data = json.loads(request.body)
        user_items = items_collection.find_one({"user_id": data["user_id"]})

        if user_items:
            for item in user_items["products"]:
                if (
                    item["product_name"].lower()
                    == data["product_details"]["product_name"].lower()
                ):
                    return JsonResponse(
                        {"error": "Item name must be unique!", "success": False}
                    )
            user_items["products"].append(data["product_details"])
            items_collection.update_one(
                {"user_id": data["user_id"]},
                {"$set": {"products": user_items["products"]}},
            )
        else:
            insert_data = {
                "user_id": data["user_id"],
                "products": [data["product_details"]],
            }
            items_collection.insert_one(insert_data)

        return JsonResponse(
            {
                "message": "Item added successfully",
                "success": True,
            },
            status=201,
        )
    else:
        return JsonResponse({"message": "Invalid request method"}, status=405)


@csrf_exempt
def get_items(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if data:
            user_items = items_collection.find_one({"user_id": data["user_id"]})

            if user_items:
                user_items["_id"] = str(user_items["_id"])
                return JsonResponse(
                    {
                        "message": "Item added successfully",
                        "success": True,
                        "user_items": user_items,
                    },
                    status=201,
                )
            else:
                return JsonResponse({"message": "Error adding item", "success": False})
        else:
            return JsonResponse({"message": "Error adding item", "success": False})


@csrf_exempt
def add_sales(request):
    if request.method == "POST":

        data = json.loads(request.body)
        user_sales = sales_collection.find_one({"user_id": data["user_id"]})
        user_id = data["user_id"]
        user_items = items_collection.find_one({"user_id": user_id})
        user_items = user_items["products"]
        for item in data["items"]:
            if item['category']!="Composite":
                for i1 in range(len(user_items)):
                    if item["name"] == user_items[i1]["product_name"]:
                        user_items[i1]["sold_quantity"] += int(item["quantity"])
                        user_items[i1]["remaining_stock"] -= int(item["quantity"])
            else:
                for i1 in range(len(user_items)):
                    if item["name"] == user_items[i1]["product_name"]:
                        for i2 in user_items[i1]['quantities']:
                            for i3 in range(len(user_items)):
                                if user_items[i3]['product_name']==i2:
                                    user_items[i3]['sold_quantity']+=(int(item['quantity'])*int(user_items[i1]['quantities'][i2]))
                                    user_items[i3]['remaining_stock']-=(int(item['quantity'])*int(user_items[i1]['quantities'][i2]))

        items_collection.update_one(
            {"user_id": user_id}, {"$set": {"products": user_items}}
        )
        if user_sales:
            del data["user_id"]
            user_sales["sales"].append(data)
            sales_collection.update_one(
                {"user_id": user_id},
                {"$set": {"sales": user_sales["sales"]}},
            )
        else:
            del data["user_id"]
            insert_data = {
                "user_id": user_id,
                "sales": [data],
            }
            sales_collection.insert_one(insert_data)

        return JsonResponse(
            {
                "message": "Item added successfully",
                "success": True,
            },
            status=201,
        )
    else:
        return JsonResponse({"message": "Invalid request method"}, status=405)