from django.http import JsonResponse
from rest_framework import viewsets
from django.views.decorators.csrf import csrf_exempt
import json
import re
from pymongo import MongoClient
import uuid
from bson import ObjectId
from django.core.mail import send_mail
from django.template.loader import render_to_string
# import pandas as pd
# from sklearn.linear_model import LinearRegression
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder

from backend_app import settings

client = MongoClient("mongodb://localhost:27017/")

db = client.my_database
customer_collection = db.customers
organization_collection = db.organization
items_collection = db.items
contact_collection = db.contact
sales_collection = db.sales
orders_collection = db.orders


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

        return JsonResponse(
            {
                "message": f"Welcome {email}",
                "user_id": user["user_id"],
                "role": user[
                    "role"
                ],  # Assuming you have a 'role' field in the user collection
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
        role = data["role"]
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
            return JsonResponse({"message": "User not found or no changes made"})

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
            contact_id = contact_collection.insert_one(
                {
                    "fullName": name,
                    "email": email,
                    "message": message,
                    "reply_sent": False,  # Initially, no reply has been sent
                }
            ).inserted_id

            return JsonResponse(
                {
                    "message": "Thank you for contacting us!",
                    "contact_id": str(contact_id),
                },
                status=201,
            )
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
            contact_id = data.get(
                "contact_id"
            )  # The ID of the contact message being replied to

            if not email or not message or not contact_id:
                return JsonResponse(
                    {"error": "Missing email, message, or contact_id"}, status=400
                )
            # Format the email message
            formatted_message = (
                f"Dear {data.get('fullName', 'Customer')},\n\n"
                f"Thank you for contacting us.\n\n"
                f"{message}\n\n"
                f"Best regards,\nInventoryIQ"
            )

            # Sending the email (adjust the subject, from email, and your SMTP settings)
            send_mail(
                subject="Reply to Your Contact Us Query",
                message=formatted_message,
                from_email="mansipatel9898.mp@gmail.com",  # Replace with your own email
                recipient_list=[email],
                fail_silently=False,
            )

            # Update the contact document to include the reply and indicate that a reply has been sent
            result = contact_collection.update_one(
                {"_id": ObjectId(contact_id)},
                {"$set": {"reply": message, "reply_sent": True}},
            )

            if result.matched_count > 0:
                return JsonResponse(
                    {"message": "Reply sent successfully", "success": True}, status=200
                )
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
        customer_name = data.get("customer_name", "N/A")
        customer_email = data.get("customer_email", None)
        items = data["items"]

        gst = data.get("gst")  # GST if applied
        discount = data.get("discount", 0)  # Discount if applied
        total = data.get("grand_total")
        sub_total = data.get("sub_total")
        user_items = items_collection.find_one({"user_id": user_id})
        user_items = user_items["products"]
        date = data["date"]

        for item in items:
            if item["category"] != "Composite":
                for i1 in range(len(user_items)):
                    if item["name"] == user_items[i1]["product_name"]:
                        if int(item["quantity"]) > user_items[i1]["remaining_stock"]:
                            return JsonResponse(
                                {
                                    "error": f"Not enough items in stock for item: {item['name']}",
                                    "success": False,
                                }
                            )
                        user_items[i1]["sold_quantity"] += int(item["quantity"])
                        user_items[i1]["remaining_stock"] -= int(item["quantity"])
                        user_items[i1]["profit_amount"] = int(
                            user_items[i1]["sold_quantity"]
                        ) * int(user_items[i1]["profit_margin"])

            else:
                for i1 in range(len(user_items)):
                    if item["name"] == user_items[i1]["product_name"]:
                        for i2 in user_items[i1]["quantities"]:
                            for i3 in range(len(user_items)):
                                if user_items[i3]["product_name"] == i2:
                                    if (
                                        int(item["quantity"])
                                        * int(user_items[i1]["quantities"][i2])
                                    ) > int(user_items[i3]["remaining_stock"]):

                                        return JsonResponse(
                                            {
                                                "error": f"Not enough items in stock for item: {user_items[i3]['product_name']}",
                                                "success": False,
                                            }
                                        )
                                    user_items[i3]["sold_quantity"] += int(
                                        item["quantity"]
                                    ) * int(user_items[i1]["quantities"][i2])
                                    user_items[i3]["remaining_stock"] -= int(
                                        item["quantity"]
                                    ) * int(user_items[i1]["quantities"][i2])
                                    user_items[i3]["profit_amount"] = int(
                                        user_items[i3]["sold_quantity"]
                                    ) * int(user_items[i3]["profit_margin"])

        # Update items collection after changes
        items_collection.update_one(
            {"user_id": user_id}, {"$set": {"products": user_items}}
        )

        # Handle sales collection
        if user_sales:
            del data["user_id"]
            user_sales["sales"].append(data)
            sales_collection.update_one(
                {"user_id": user_id},
                {"$set": {"sales": user_sales["sales"]}},
            )
        else:
            del data["user_id"]
            insert_data = {"user_id": user_id, "sales": [data], "date": date}
            sales_collection.insert_one(insert_data)

        # Generate the HTML email content
        email_body = render_to_string(
            "sales_email_template.html",
            {
                "customer_name": customer_name,
                "customer_email": customer_email,
                "items": items,
                "subtotal": sub_total,
                "gst": gst,
                "discount": discount,
                "total": total,
            },
        )

        # Send email if customer email exists
        if customer_email:
            subject = "Bill"
            recipient_list = [customer_email]  # Send to the customer
            send_mail(
                subject,
                "",  # Plain text version, leave blank for HTML
                "mansipatel9898.mp@gmail.com",  # Sender email
                recipient_list,
                fail_silently=False,
                html_message=email_body,  # Send HTML message
            )

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
def edit_item(request, product_name):
    if request.method == "PUT":
        data = json.loads(request.body)
        user_id = data.get("user_id")
        product_details = data.get("product_details")
        new_product_name = product_details.get("product_name")

        if not user_id or not product_details:
            return JsonResponse(
                {"message": "Invalid request data", "success": False}, status=400
            )

        user_items = items_collection.find_one({"user_id": user_id})

        if user_items:
            updated_products = []
            item_found = False  # Add a flag to check if the item is found
            for product in user_items["products"]:
                if product["product_name"] == product_name:
                    updated_products.append(
                        product_details
                    )  # Replace with updated details
                    item_found = True  # Item is found and updated
                else:
                    updated_products.append(product)  # Keep other products unchanged

            if not item_found:
                return JsonResponse(
                    {"message": "Item not found", "success": False}, status=404
                )

            items_collection.update_one(
                {"user_id": user_id},
                {"$set": {"products": updated_products}},
            )

            return JsonResponse(
                {
                    "message": "Item updated successfully",
                    "success": True,
                },
                status=200,
            )
        else:
            return JsonResponse(
                {"message": "User not found", "success": False}, status=404
            )
    else:
        return JsonResponse(
            {"message": "Invalid request method", "success": False}, status=405
        )


@csrf_exempt
def delete_item(request, product_name):
    if request.method == "DELETE":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            print(user_id)
            if not user_id:
                return JsonResponse(
                    {"message": "Invalid request data", "success": False}, status=400
                )

            user_items = items_collection.find_one({"user_id": user_id})

            if user_items:
                updated_products = [
                    item
                    for item in user_items["products"]
                    if item["product_name"].lower() != product_name.lower()
                ]

                if len(updated_products) == len(user_items["products"]):
                    return JsonResponse(
                        {"message": "Item not found", "success": False}, status=404
                    )

                items_collection.update_one(
                    {"user_id": user_id}, {"$set": {"products": updated_products}}
                )

                return JsonResponse(
                    {"message": "Item deleted successfully", "success": True},
                    status=200,
                )
            else:
                return JsonResponse(
                    {"message": "User not found", "success": False}, status=404
                )
        except json.JSONDecodeError:
            return JsonResponse(
                {"message": "Invalid JSON format", "success": False}, status=400
            )
        except Exception as e:
            return JsonResponse(
                {"message": f"Error occurred: {str(e)}", "success": False}, status=500
            )
    else:
        return JsonResponse(
            {"message": "Invalid request method", "success": False}, status=405
        )


@csrf_exempt
def add_item_order(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_orders = orders_collection.find_one({"user_id": data["user_id"]})
        user_items = items_collection.find_one({"user_id": data["user_id"]})
        user_items = user_items["products"]

        print(data["order_details"]["items"])
        for item in data["order_details"]["items"]:
            for i1 in range(len(user_items)):
                if item["name"] == user_items[i1]["product_name"]:
                    user_items[i1]["bought_quantity"] += int(item["quantity"])
                    user_items[i1]["invested_amount"] += int(item["quantity"]) * int(
                        user_items[i1]["cost_price"]
                    )
                    user_items[i1]["remaining_stock"] += int(item["quantity"])
        items_collection.update_one(
            {"user_id": data["user_id"]},
            {"$set": {"products": user_items}},
        )

        if user_orders:
            user_orders["orders"].append(data["order_details"])
            orders_collection.update_one(
                {"user_id": data["user_id"]},
                {"$set": {"orders": user_orders["orders"]}},
            )
        else:
            insert_data = {
                "user_id": data["user_id"],
                "orders": [data["order_details"]],
            }
            orders_collection.insert_one(insert_data)

        return JsonResponse(
            {
                "message": "Order added successfully",
                "success": True,
            },
            status=201,
        )
    else:
        return JsonResponse({"message": "Invalid request method"}, status=405)


def send_sales_order_email(
    customer_name, customer_email, rows, subtotal, gst, discount, grand_total
):
    subject = "Your Sales Order Details"
    message = (
        f"Dear {customer_name},\n\nThank you for your order. Here are the details:\n\n"
    )

    # Format the table in the email
    message += "Item Name\tQuantity\tRate\tAmount\n"
    for row in rows:
        message += f"{row['name']}\t{row['quantity']}\t{row['sellingPrice']}\t{row['amount']}\n"

    # Add totals
    message += f"\nSub Total: {subtotal}\n"
    message += f"GST (18%): {gst}\n"
    message += f"Discount: {discount}%\n"
    message += f"Grand Total: {grand_total}\n"
    message += "\nThank you for shopping with us!"

    # Send the email
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [customer_email],
        fail_silently=False,
    )


@csrf_exempt
def get_sales(request):
    data = json.loads(request.body)
    if request.method == "POST":
        user_id = data["user_id"]
        user_sales = sales_collection.find_one({"user_id": user_id})
        date = user_sales["date"]
        if user_sales:
            user_sales = user_sales["sales"]
            return JsonResponse(
                {
                    "message": "Sales Feteched successfully",
                    "sales": user_sales,
                    "success": True,
                    "date": date,
                },
                status=200,
            )
        else:
            return JsonResponse(
                {
                    "message": "Sales Feteched successfully",
                    "sales": user_sales,
                    "date": date,
                    "success": False,
                },
                status=200,
            )
    else:
        return JsonResponse({"message": "Invalid request method"}, status=405)


@csrf_exempt
def get_suggestions(request):
    data = json.loads(request.body)
    if request.method == "POST":
        user_id = data["user_id"]
        days_diff = int(data["days_diff"])
        budget = data["budget"]
        if budget == "":
            return JsonResponse(
                {
                    "error": "Budget cannot be empty!",
                    "success": False,
                },
                status=200,
            )
        budget = int(data["budget"])
        if budget <= 0:
            return JsonResponse(
                {
                    "error": "Budget cannot be negative or zero!",
                    "success": False,
                },
                status=200,
            )
        if days_diff < 28:
            return JsonResponse(
                {
                    "error": "Atleast data of a month is required for Predictions. Try Later",
                    "success": False,
                },
                status=200,
            )

        user_items = items_collection.find_one({"user_id": user_id})
        if user_items:
            user_items = user_items["products"]
            data = {
                "cost_price": [],
                "selling_price": [],
                "bought_quantity": [],
                "sold_quantity": [],
                "profit_margin": [],
                "remaining_stock": [],
                "invested_amount": [],
                "profit_amount": [],
            }

            for item in user_items:
                if item["category"] != "Composite":
                    data["cost_price"].append(item.get("cost_price", 0))
                    data["selling_price"].append(item.get("selling_price", 0))
                    data["bought_quantity"].append(item.get("bought_quantity", 0))
                    data["sold_quantity"].append(item.get("sold_quantity", 0))
                    data["profit_margin"].append(item.get("profit_margin", 0))
                    data["remaining_stock"].append(item.get("remaining_stock", 0))
                    data["invested_amount"].append(item.get("invested_amount", 0))
                    data["profit_amount"].append(item.get("profit_amount", 0))

            df = pd.DataFrame(data)

            X = df.drop(columns=["bought_quantity"])
            y = df["bought_quantity"]

            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )

            model = LinearRegression()
            model.fit(X_train, y_train)

            def predict_bought_quantities(model, features, budget, prices):
                predictions = model.predict(features)

                total_cost = predictions * prices

                print("Initial Predictions:", predictions)
                print("Total Cost:", total_cost)

                if total_cost.sum() == budget:
                    return predictions

                scaling_factor = budget / total_cost.sum()
                feasible_quantities = predictions * scaling_factor

                print("Scaling Factor:", scaling_factor)
                print("Feasible Quantities after Scaling:", feasible_quantities)

                return feasible_quantities

            next_month_features = pd.DataFrame(
                {
                    "cost_price": df["cost_price"].values,
                    "selling_price": df["selling_price"].values,
                    "sold_quantity": df["sold_quantity"].values,
                    "profit_margin": df["profit_margin"].values,
                    "remaining_stock": df["remaining_stock"].values,
                    "invested_amount": df["invested_amount"].values,
                    "profit_amount": df["profit_amount"].values,
                }
            )

            cost_prices = next_month_features["cost_price"].values
            predicted_quantities = predict_bought_quantities(
                model, next_month_features, budget, cost_prices
            )

            x = predicted_quantities.tolist()

            return JsonResponse(
                {
                    "message": "Items Feteched successfully",
                    "success": True,
                    "data": x,
                    "user_items": user_items,
                },
                status=200,
            )
        else:
            return JsonResponse(
                {"message": "No tems found", "success": False}, status=200
            )
    else:
        return JsonResponse({"message": "Invalid request method"}, status=405)
