from django.http import JsonResponse
from rest_framework import viewsets
from django.views.decorators.csrf import csrf_exempt
import json
import re
from pymongo import MongoClient
import uuid
from bson import ObjectId

client = MongoClient("mongodb://localhost:27017/")

db = client.my_database
customer_collection = db.customers
organization_collection = db.organization


@csrf_exempt
def sign_in(request):
    if request.method == "POST":

        data = json.loads(request.body)
        email = data["email"]
        password = data["password"]

        regex = r"^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$"

        if not re.match(regex, email):
            return JsonResponse(
                {"email": "Invalid Email , please enter a valid email address"}
            )

        user = customer_collection.find_one({"email": email})
        if user != None:
            if password != user["password"]:
                return JsonResponse({"notMatch": "Password is invalid"})
            pass
        else:
            return JsonResponse({"notMatch": "No such user with this email found"})
        return JsonResponse(
            {
                "message": f"Welcome {email}",
                "user_id": user["user_id"],
                "success": True,
            },
            status=200,
        )


@csrf_exempt
def sign_up(request):
    if request.method == "POST":

        data = json.loads(request.body)
        email = data["email"]
        password = data["password"]
        cpass = data["cpassword"]

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
            return JsonResponse({"message": "Organization added successfully", "user_id": data["org_user_id"], "success": True}, status=201)
        except Exception as e:
            return JsonResponse({"message": "An error occurred", "error": str(e)}, status=500)
        
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

            organization_collection.update_one({"_id": ObjectId(org_id)}, {"$set": updated_data})
            return JsonResponse({"message": "Organization updated successfully", "success": True}, status=200)
        except Exception as e:
            return JsonResponse({"message": "An error occurred", "error": str(e)}, status=500)
