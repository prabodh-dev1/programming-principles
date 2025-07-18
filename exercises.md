# DRY (Don't Repeat Yourself) Principle Exercises

## 1. Principle Introduction

**Principle Name:** DRY - Don't Repeat Yourself

**Core Concept:** The DRY principle states that "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system." [1] This means avoiding duplication of code, logic, or data. When you find yourself writing the same or very similar code multiple times, it's a strong indicator that you're violating the DRY principle.

**Importance in E-commerce:** In an e-commerce application, adhering to DRY is crucial for several reasons:
*   **Maintainability:** Changes to duplicated code require updates in multiple places, increasing the risk of inconsistencies and bugs. A single change can be applied once if the code is DRY.
*   **Readability:** Less duplicated code means a smaller codebase, which is easier to read, understand, and navigate.
*   **Reduced Bugs:** A single source of truth for logic reduces the surface area for bugs. If a bug is found, it only needs to be fixed in one place.
*   **Faster Development:** Reusable components and functions speed up development by eliminating the need to write the same code repeatedly.

## 2. Python DRY Exercises: Data Validation

### Scenario: User Registration and Profile Update

In an e-commerce application, user data often needs to be validated at various points, such as during registration and when a user updates their profile. A common violation of DRY occurs when the same validation logic is replicated in different parts of the codebase.

### "Before" Scenario (Problematic Code - Python)

Consider a scenario where user email and password validation is performed directly within the user registration and profile update functions. This leads to duplicated validation logic.

```python
# users.py (Problematic - Before DRY)

def register_user(username, email, password):
    # Validate email
    if not "@" in email or not "." in email:
        return {"error": "Invalid email format"}
    if len(email) > 255:
        return {"error": "Email too long"}

    # Validate password
    if len(password) < 8:
        return {"error": "Password too short"}
    if not any(char.isdigit() for char in password):
        return {"error": "Password must contain a digit"}
    if not any(char.isupper() for char in password):
        return {"error": "Password must contain an uppercase letter"}

    # ... (rest of registration logic)
    print(f"Registering user: {username}, {email}")
    return {"message": "User registered successfully"}

def update_user_profile(user_id, email, password=None):
    # Validate email (duplicated logic)
    if not "@" in email or not "." in email:
        return {"error": "Invalid email format"}
    if len(email) > 255:
        return {"error": "Email too long"}

    if password:
        # Validate password (duplicated logic)
        if len(password) < 8:
            return {"error": "Password too short"}
        if not any(char.isdigit() for char in password):
            return {"error": "Password must contain a digit"}
        if not any(char.isupper() for char in password):
            return {"error": "Password must contain an uppercase letter"}

    # ... (rest of profile update logic)
    print(f"Updating profile for user: {user_id}, {email}")
    return {"message": "Profile updated successfully"}

# Example Usage:
print(register_user("john_doe", "john@example.com", "Password123"))
print(register_user("jane_doe", "jane.example.com", "pass")) # Invalid email and password
print(update_user_profile(1, "john.doe@newemail.com", "NewPass456"))
print(update_user_profile(2, "invalid-email", None)) # Invalid email
```

**Comments on the Problematic Code:**
*   The email validation logic is repeated verbatim in both `register_user` and `update_user_profile`.
*   The password validation logic is also duplicated, appearing in both functions.
*   Any change to validation rules (e.g., adding a minimum length for username) would require modifying multiple functions, increasing maintenance overhead and potential for errors.

### "After" Scenario (Improved Code - Python)

To adhere to the DRY principle, we can extract the common validation logic into dedicated, reusable functions. This makes the code more maintainable, readable, and less prone to errors.

```python
# utils/validation.py
import re

def is_valid_email(email):
    if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email):
        return False, "Invalid email format"
    if len(email) > 255:
        return False, "Email too long"
    return True, ""

def is_strong_password(password):
    if len(password) < 8:
        return False, "Password too short"
    if not any(char.isdigit() for char in password):
        return False, "Password must contain a digit"
    if not any(char.isupper() for char in password):
        return False, "Password must contain an uppercase letter"
    if not any(char.islower() for char in password):
        return False, "Password must contain a lowercase letter"
    return True, ""

# services/user_service.py (After DRY)
from utils.validation import is_valid_email, is_strong_password

def register_user(username, email, password):
    valid, error_msg = is_valid_email(email)
    if not valid:
        return {"error": error_msg}

    valid, error_msg = is_strong_password(password)
    if not valid:
        return {"error": error_msg}

    # ... (rest of registration logic)
    print(f"Registering user: {username}, {email}")
    return {"message": "User registered successfully"}

def update_user_profile(user_id, email, password=None):
    valid, error_msg = is_valid_email(email)
    if not valid:
        return {"error": error_msg}

    if password:
        valid, error_msg = is_strong_password(password)
        if not valid:
            return {"error": error_msg}

    # ... (rest of profile update logic)
    print(f"Updating profile for user: {user_id}, {email}")
    return {"message": "Profile updated successfully"}

# Example Usage:
print(register_user("alice", "alice@example.com", "SecurePass123"))
print(register_user("bob", "bob.example.com", "weak")) # Invalid email and password
print(update_user_profile(3, "alice.new@email.com", "VerySecure456"))
print(update_user_profile(4, "another-invalid", None)) # Invalid email
```

**Comments on the Improved Code:**
*   The email and password validation logic is now encapsulated in `is_valid_email` and `is_strong_password` functions within `utils/validation.py`.
*   `register_user` and `update_user_profile` now *call* these validation functions, rather than duplicating the logic.
*   Any future changes to validation rules only need to be made in one place (the `utils/validation.py` file), significantly improving maintainability.

### Exercise: Apply DRY to Product Data Handling (Python)

**Task:** In an e-commerce application, product data often needs to be sanitized and validated before being saved to the database or displayed to users. This includes ensuring that product names are not empty, prices are positive numbers, and stock quantities are non-negative integers. Your task is to refactor the following problematic Python code to adhere to the DRY principle by extracting common product data handling logic into reusable functions.

**Instructions:**
1.  Create a new file `utils/product_utils.py`.
2.  In `utils/product_utils.py`, implement functions like `validate_product_data(product_data)` and `sanitize_product_name(name)`.
3.  Modify the `create_product` and `update_product` functions in `services/product_service.py` to use these new utility functions.
4.  Ensure that error messages are returned if validation fails.

**Problematic Code (Python - `services/product_service.py`):

```python
# services/product_service.py (Problematic - Before DRY)

def create_product(name, description, price, stock):
    # Validate name
    if not name or len(name.strip()) == 0:
        return {"error": "Product name cannot be empty"}

    # Validate price
    if not isinstance(price, (int, float)) or price <= 0:
        return {"error": "Price must be a positive number"}

    # Validate stock
    if not isinstance(stock, int) or stock < 0:
        return {"error": "Stock must be a non-negative integer"}

    # Sanitize name (e.g., remove leading/trailing spaces)
    sanitized_name = name.strip()

    # ... (rest of product creation logic)
    print(f"Creating product: {sanitized_name}")
    return {"message": "Product created successfully"}

def update_product(product_id, name=None, description=None, price=None, stock=None):
    # Duplicated validation and sanitization logic
    if name is not None:
        if not name or len(name.strip()) == 0:
            return {"error": "Product name cannot be empty"}
        sanitized_name = name.strip()
    else:
        sanitized_name = None

    if price is not None:
        if not isinstance(price, (int, float)) or price <= 0:
            return {"error": "Price must be a positive number"}

    if stock is not None:
        if not isinstance(stock, int) or stock < 0:
            return {"error": "Stock must be a non-negative integer"}

    # ... (rest of product update logic)
    print(f"Updating product {product_id}")
    return {"message": "Product updated successfully"}

# Example Usage:
print(create_product("  Laptop  ", "Powerful laptop", 1200, 50))
print(create_product("", "Empty name", 100, 10)) # Invalid name
print(update_product(1, price=-50)) # Invalid price
```

**Expected Outcome:**

Your refactored code should:
*   Have a `validate_product_data` function that takes a dictionary of product data and returns `(True, "")` on success or `(False, "error_message")` on failure.
*   Have a `sanitize_product_name` function that takes a product name string and returns its sanitized version.
*   The `create_product` and `update_product` functions should be significantly shorter and cleaner, relying on the utility functions for validation and sanitization.

## 3. Node.js/Next.js DRY Exercises: API Response Formatting

### Scenario: Consistent API Response Structure

In a Next.js API route or a Node.js backend, it's common to return consistent JSON responses for success and error scenarios. Duplicating the structure for every API endpoint violates DRY.

### "Before" Scenario (Problematic Code - Node.js/Next.js)

Consider API routes for fetching products and user profiles, where success and error responses are manually constructed in each route.

```javascript
// pages/api/products/[id].js (Problematic - Before DRY)

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Simulate fetching product from DB
    if (id === '1') {
      res.status(200).json({
        success: true,
        data: {
          id: '1',
          name: 'Wireless Mouse',
          price: 25.99,
          stock: 150
        },
        message: 'Product fetched successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Product not found',
        message: 'Product with given ID does not exist'
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      message: `Method ${req.method} not allowed for this route`
    });
  }
}

// pages/api/users/[id].js (Problematic - Before DRY)

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Simulate fetching user from DB
    if (id === '101') {
      res.status(200).json({
        success: true,
        data: {
          id: '101',
          username: 'johndoe',
          email: 'john@example.com'
        },
        message: 'User profile fetched successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User with given ID does not exist'
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      message: `Method ${req.method} not allowed for this route`
    });
  }
}
```

**Comments on the Problematic Code:**
*   The structure for success responses (`success: true, data, message`) and error responses (`success: false, error, message`) is repeated in both API routes.
*   Status code handling (`res.status().json()`) is also duplicated.
*   Any change to the standard API response format would require modifications across all API routes.

### "After" Scenario (Improved Code - Node.js/Next.js)

To apply DRY, we can create a utility module for consistent API response handling. This module will provide helper functions to send standardized success and error responses.

```javascript
// utils/apiResponse.js

export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const errorResponse = (res, error, message = 'An error occurred', statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error,
    message,
  });
};

export const methodNotAllowed = (res, method) => {
  errorResponse(res, 'Method Not Allowed', `Method ${method} not allowed for this route`, 405);
};

// pages/api/products/[id].js (After DRY)
import { successResponse, errorResponse, methodNotAllowed } from '../../../utils/apiResponse';

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Simulate fetching product from DB
    if (id === '1') {
      successResponse(res, {
        id: '1',
        name: 'Wireless Mouse',
        price: 25.99,
        stock: 150
      }, 'Product fetched successfully');
    } else {
      errorResponse(res, 'Product not found', 'Product with given ID does not exist', 404);
    }
  } else {
    methodNotAllowed(res, req.method);
  }
}

// pages/api/users/[id].js (After DRY)
import { successResponse, errorResponse, methodNotAllowed } from '../../../utils/apiResponse';

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Simulate fetching user from DB
    if (id === '101') {
      successResponse(res, {
        id: '101',
        username: 'johndoe',
        email: 'john@example.com'
      }, 'User profile fetched successfully');
    } else {
      errorResponse(res, 'User not found', 'User with given ID does not exist', 404);
    }
  } else {
    methodNotAllowed(res, req.method);
  }
}
```

**Comments on the Improved Code:**
*   The `utils/apiResponse.js` module now centralizes the logic for sending success, error, and method not allowed responses.
*   API routes are much cleaner and only focus on their specific business logic, delegating response formatting to the utility functions.
*   Changes to the API response structure can now be made in a single place, ensuring consistency across the entire API.

### Exercise: Apply DRY to UI Component Styling (Node.js/Next.js)

**Task:** In a Next.js e-commerce frontend, buttons often share common styling properties (e.g., padding, border-radius, font-size) but might have slight variations for different purposes (e.g., primary, secondary, danger). Your task is to refactor the following problematic Next.js/React code to adhere to the DRY principle by creating a reusable `Button` component that encapsulates common styles and allows for easy customization.

**Instructions:**
1.  Create a new file `components/Button.js`.
2.  In `components/Button.js`, create a React functional component that accepts `children`, `variant` (e.g., 'primary', 'secondary', 'danger'), and other standard button props.
3.  Use CSS Modules or Styled Components (or simple inline styles for this exercise) to apply common styles and conditional styles based on the `variant` prop.
4.  Modify the `ProductCard.js` and `CheckoutForm.js` components to use your new `Button` component.

**Problematic Code (Node.js/Next.js - `components/ProductCard.js` and `components/CheckoutForm.js`):

```javascript
// components/ProductCard.js (Problematic - Before DRY)

function ProductCard({ product }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center',
      marginBottom: '20px'
    }}>
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
      <button style={{
        backgroundColor: '#0070f3',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px'
      }}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;

// components/CheckoutForm.js (Problematic - Before DRY)

function CheckoutForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Order Placed!');
  };

  return (
    <form onSubmit={handleSubmit} style={{
      border: '1px solid #eee',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '500px',
      margin: '20px auto'
    }}>
      <h2>Checkout</h2>
      {/* ... form fields ... */}
      <button type="submit" style={{
        backgroundColor: '#28a745',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        marginTop: '20px'
      }}>
        Place Order
      </button>
      <button type="button" style={{
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        marginTop: '20px',
        marginLeft: '10px'
      }}>
        Cancel
      </button>
    </form>
  );
}

export default CheckoutForm;
```

**Expected Outcome:**

Your refactored code should:
*   Have a `Button.js` component that defines common button styles.
*   Allow `ProductCard` and `CheckoutForm` to use the `Button` component, passing props like `variant` to customize its appearance (e.g., `<Button variant="primary">Add to Cart</Button>`, `<Button variant="success">Place Order</Button>`, `<Button variant="danger">Cancel</Button>`).
*   The styling logic should be centralized in `Button.js`, making it easy to modify button appearances application-wide.

## References

[1] The Pragmatic Programmer: From Journeyman to Master. Andrew Hunt and David Thomas. Addison-Wesley Professional, 1999. URL: https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/




## KISS (Keep It Simple, Stupid) Principle Exercises

### 1. Principle Introduction

**Principle Name:** KISS - Keep It Simple, Stupid

**Core Concept:** The KISS principle advocates for simplicity in design and development. It suggests that most systems work best if they are kept simple rather than made complicated; therefore, simplicity should be a key goal in design, and unnecessary complexity should be avoided. [1] The essence is to avoid over-engineering and to find the most straightforward solution to a problem.

**Importance in E-commerce:** For e-commerce applications, KISS is vital for:
*   **Readability and Understanding:** Simple code is easier for developers to read, understand, and onboard new team members, reducing the learning curve.
*   **Reduced Bugs:** Complex code paths are more prone to errors and harder to debug. Simpler logic means fewer opportunities for bugs to hide.
*   **Faster Development and Deployment:** Less complex solutions are quicker to implement and test, leading to faster iteration cycles.
*   **Easier Maintenance:** Simple systems are inherently easier to maintain and evolve over time, as there are fewer moving parts and less intricate dependencies.
*   **Performance:** Often, simpler algorithms and designs are more efficient and performant.

### 2. Python KISS Exercises: Order Processing Logic

### Scenario: Complex Discount Calculation

An e-commerce platform often deals with various discount rules. A common violation of KISS occurs when the logic for applying these discounts becomes overly complex, with deeply nested conditionals or convoluted calculations, even for relatively straightforward scenarios.

### "Before" Scenario (Problematic Code - Python)

Consider a function that calculates the final price of an order, applying discounts based on multiple conditions. This example demonstrates a complex, hard-to-read implementation.

```python
# services/order_service.py (Problematic - Before KISS)

def calculate_final_order_price(items, user_status, coupon_code=None, is_first_purchase=False):
    total_price = sum(item["price"] * item["quantity"] for item in items)

    # Apply discounts - overly complex logic
    if user_status == "premium":
        if total_price > 100:
            total_price *= 0.85  # 15% off for premium orders over $100
        else:
            total_price *= 0.90  # 10% off for premium orders under $100
    elif user_status == "gold":
        if total_price > 200:
            total_price *= 0.80  # 20% off for gold orders over $200
        else:
            total_price *= 0.95  # 5% off for gold orders under $200
    else: # regular user
        if is_first_purchase:
            total_price *= 0.90 # 10% off for first purchase
        elif coupon_code == "SAVE20":
            total_price -= 20 # $20 off with coupon
            if total_price < 0: total_price = 0
        elif coupon_code == "FREESHIP":
            print("Free shipping applied (not affecting price)")

    # Additional complex logic for specific items or categories
    for item in items:
        if item["category"] == "electronics" and item["price"] > 500:
            total_price *= 0.98 # 2% off high-value electronics
        if item["name"] == "Gift Card" and total_price > 50:
            total_price -= 5 # $5 off if gift card and total over $50

    # Tax calculation (simplified)
    total_price *= 1.08 # 8% tax

    return round(total_price, 2)

# Example Usage:
items1 = [{"name": "Laptop", "price": 1000, "quantity": 1, "category": "electronics"}]
print(f"Premium user, >$100: {calculate_final_order_price(items1, 'premium')}")

items2 = [{"name": "Book", "price": 20, "quantity": 2, "category": "books"}]
print(f"Regular user, first purchase: {calculate_final_order_price(items2, 'regular', is_first_purchase=True)}")

items3 = [{"name": "Headphones", "price": 150, "quantity": 1, "category": "audio"}]
print(f"Gold user, <$200: {calculate_final_order_price(items3, 'gold')}")
```

**Comments on the Problematic Code:**
*   The function is too long and tries to do too many things (calculate base price, apply various discounts, apply tax).
*   Deeply nested `if/elif/else` statements make the discount logic hard to follow and modify.
*   The order of discount application is implicit and hard to reason about.
*   Adding a new discount rule would likely require modifying existing `if/elif` blocks, increasing complexity and risk of bugs.

### "After" Scenario (Improved Code - Python)

To adhere to the KISS principle, we can break down the complex calculation into smaller, more focused functions. We can also use a more structured approach for applying discounts, such as a list of discount rules.

```python
# services/order_service.py (After KISS)

def _calculate_base_price(items):
    return sum(item["price"] * item["quantity"] for item in items)

def _apply_user_status_discount(price, user_status):
    if user_status == "premium":
        return price * (0.85 if price > 100 else 0.90)
    elif user_status == "gold":
        return price * (0.80 if price > 200 else 0.95)
    return price

def _apply_coupon_discount(price, coupon_code):
    if coupon_code == "SAVE20":
        return max(0, price - 20)
    # FREESHIP is handled elsewhere, not affecting price here
    return price

def _apply_first_purchase_discount(price, is_first_purchase):
    return price * 0.90 if is_first_purchase else price

def _apply_item_specific_discounts(price, items):
    current_price = price
    for item in items:
        if item["category"] == "electronics" and item["price"] > 500:
            current_price *= 0.98
        if item["name"] == "Gift Card" and current_price > 50:
            current_price -= 5
    return current_price

def calculate_final_order_price(items, user_status, coupon_code=None, is_first_purchase=False):
    total_price = _calculate_base_price(items)

    # Apply discounts in a clear, sequential order
    total_price = _apply_user_status_discount(total_price, user_status)
    total_price = _apply_first_purchase_discount(total_price, is_first_purchase)
    total_price = _apply_coupon_discount(total_price, coupon_code)
    total_price = _apply_item_specific_discounts(total_price, items)

    # Apply tax
    total_price *= 1.08

    return round(total_price, 2)

# Example Usage:
items1 = [{"name": "Laptop", "price": 1000, "quantity": 1, "category": "electronics"}]
print(f"Premium user, >$100: {calculate_final_order_price(items1, 'premium')}")

items2 = [{"name": "Book", "price": 20, "quantity": 2, "category": "books"}]
print(f"Regular user, first purchase: {calculate_final_order_price(items2, 'regular', is_first_purchase=True)}")

items3 = [{"name": "Headphones", "price": 150, "quantity": 1, "category": "audio"}]
print(f"Gold user, <$200: {calculate_final_order_price(items3, 'gold')}")
```

**Comments on the Improved Code:**
*   The main `calculate_final_order_price` function is now much simpler, orchestrating calls to smaller, single-purpose helper functions.
*   Each helper function (`_calculate_base_price`, `_apply_user_status_discount`, etc.) is responsible for one specific part of the calculation, making them easier to understand, test, and maintain.
*   The order of discount application is explicit and easy to change if business rules evolve.
*   Adding a new discount type would involve creating a new small function and adding it to the sequence in the main function, rather than modifying complex nested logic.

### Exercise: Simplify Product Search Filtering (Python)

**Task:** An e-commerce product search feature allows users to filter products by category, price range, and availability (in-stock). The current implementation has a single, complex function that handles all filtering logic with multiple nested conditions. Your task is to refactor this function to adhere to the KISS principle, making it simpler, more readable, and easier to extend.

**Instructions:**
1.  Break down the `filter_products` function into smaller, more focused helper functions (e.g., `_filter_by_category`, `_filter_by_price_range`, `_filter_by_stock`).
2.  The main `filter_products` function should orchestrate these helper functions in a clear, sequential manner.
3.  Ensure the refactored code is easy to understand and modify if new filter criteria are added in the future.

**Problematic Code (Python - `services/product_service.py`):

```python
# services/product_service.py (Problematic - Before KISS)

def filter_products(products, category=None, min_price=None, max_price=None, in_stock_only=False):
    filtered_products = []
    for product in products:
        match_category = True
        match_price = True
        match_stock = True

        if category:
            if product["category"] != category:
                match_category = False

        if min_price is not None:
            if product["price"] < min_price:
                match_price = False

        if max_price is not None:
            if product["price"] > max_price:
                match_price = False

        if in_stock_only:
            if product["stock"] <= 0:
                match_stock = False

        if match_category and match_price and match_stock:
            filtered_products.append(product)

    return filtered_products

# Example Usage:
all_products = [
    {"id": 1, "name": "Laptop", "category": "electronics", "price": 1200, "stock": 50},
    {"id": 2, "name": "Keyboard", "category": "electronics", "price": 75, "stock": 10},
    {"id": 3, "name": "Desk Chair", "category": "furniture", "price": 250, "stock": 0},
    {"id": 4, "name": "Monitor", "category": "electronics", "price": 300, "stock": 25},
    {"id": 5, "name": "Mouse Pad", "category": "accessories", "price": 15, "stock": 100},
]

print("All products:", filter_products(all_products))
print("Electronics, <$500, in stock:", filter_products(all_products, category="electronics", max_price=500, in_stock_only=True))
print("Furniture, in stock:", filter_products(all_products, category="furniture", in_stock_only=True))
```

**Expected Outcome:**

Your refactored `filter_products` function should:
*   Be significantly simpler, delegating specific filtering logic to helper functions.
*   Be easy to read and understand the flow of filtering.
*   Allow for easy addition of new filter criteria without modifying existing filter logic.

### 3. Node.js/Next.js KISS Exercises: Frontend Form Handling

### Scenario: Overly Complex Checkout Form Validation

Frontend forms, especially in e-commerce checkout processes, can become very complex due to numerous input fields and validation rules. Violating KISS often leads to a single, monolithic function handling all validation and submission logic, making it hard to manage.

### "Before" Scenario (Problematic Code - Node.js/Next.js)

Consider a `CheckoutForm` component with an `handleSubmit` function that contains all the validation logic for multiple fields (email, address, credit card, etc.) and then attempts to submit the order.

```javascript
// components/CheckoutForm.js (Problematic - Before KISS)

import React, { useState } from 'react';

function CheckoutForm() {
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    let isValid = true;

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Address validation
    if (!formData.address || formData.address.length < 5) {
      newErrors.address = 'Address is required and must be at least 5 characters';
      isValid = false;
    }

    // City validation
    if (!formData.city) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    // Zip Code validation
    if (!formData.zipCode || !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid zip code format';
      isValid = false;
    }

    // Credit Card Number validation (simplified)
    if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
      isValid = false;
    }

    // Expiry Date validation (MM/YY)
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date format (MM/YY)';
      isValid = false;
    } else {
      const [month, year] = formData.expiryDate.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
        isValid = false;
      }
    }

    // CVV validation
    if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      console.log('Form is valid, submitting:', formData);
      // Simulate API call
      alert('Order placed successfully!');
    } else {
      console.log('Form has errors:', newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Checkout Information</h2>
      {/* ... input fields with value={formData.field} and onChange={handleChange} ... */}
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>
      <div>
        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
        {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
      </div>
      {/* ... other fields ... */}
      <button type="submit">Place Order</button>
    </form>
  );
}

export default CheckoutForm;
```

**Comments on the Problematic Code:**
*   The `handleSubmit` function is excessively long and contains all validation logic directly.
*   Adding or modifying a validation rule requires digging through a large function.
*   The function mixes validation concerns with form submission concerns.
*   Error handling and state management for errors are intertwined with validation logic.

### "After" Scenario (Improved Code - Node.js/Next.js)

To apply KISS, we can extract validation logic into a separate utility function or module. This makes the `handleSubmit` function much cleaner and focused solely on the submission process.

```javascript
// utils/formValidation.js

export const validateCheckoutForm = (formData) => {
  let errors = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!formData.address || formData.address.length < 5) {
    errors.address = 'Address is required and must be at least 5 characters';
  }

  if (!formData.city) {
    errors.city = 'City is required';
  }

  if (!formData.zipCode || !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
    errors.zipCode = 'Invalid zip code format';
  }

  if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber)) {
    errors.cardNumber = 'Card number must be 16 digits';
  }

  if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
    errors.expiryDate = 'Invalid expiry date format (MM/YY)';
  } else {
    const [month, year] = formData.expiryDate.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      errors.expiryDate = 'Card has expired';
    }
  }

  if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) {
    errors.cvv = 'CVV must be 3 or 4 digits';
  }

  return errors;
};

// components/CheckoutForm.js (After KISS)

import React, { useState } from 'react';
import { validateCheckoutForm } from '../utils/formValidation';

function CheckoutForm() {
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateCheckoutForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form is valid, submitting:', formData);
      // Simulate API call
      alert('Order placed successfully!');
    } else {
      console.log('Form has errors:', newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Checkout Information</h2>
      {/* ... input fields with value={formData.field} and onChange={handleChange} ... */}
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>
      <div>
        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
        {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
      </div>
      {/* ... other fields ... */}
      <button type="submit">Place Order</button>
    </form>
  );
}

export default CheckoutForm;
```

**Comments on the Improved Code:**
*   The `validateCheckoutForm` function is now a pure function, solely responsible for validating the form data and returning an errors object.
*   The `handleSubmit` function in `CheckoutForm` is much simpler, focusing on calling the validation utility and then handling the submission based on the validation result.
*   This separation of concerns makes both the validation logic and the form component easier to understand, test, and maintain.

### Exercise: Simplify Product Display Logic (Node.js/Next.js)

**Task:** An e-commerce product listing page displays products, and for each product, it needs to determine if it's 


in stock, if it's a new arrival, or if it's on sale. The current implementation uses a single, complex rendering logic within the `ProductCard` component that makes it hard to read and extend. Your task is to refactor this component to adhere to the KISS principle, making the display logic simpler and more modular.

**Instructions:**
1.  Create helper functions or small components to encapsulate specific display logic (e.g., `isInStock`, `isNewArrival`, `isOnSale`).
2.  Modify the `ProductCard` component to use these helper functions/components, making its rendering logic cleaner and more declarative.
3.  Ensure the refactored code is easy to understand and modify if new display badges or conditions are added in the future.

**Problematic Code (Node.js/Next.js - `components/ProductCard.js`):

```javascript
// components/ProductCard.js (Problematic - Before KISS)

function ProductCard({ product }) {
  const isNew = (product.createdAt && (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24) < 30);
  const isAvailable = product.stock > 0;
  const hasDiscount = product.originalPrice && product.price < product.originalPrice;

  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center',
      marginBottom: '20px',
      position: 'relative'
    }}>
      {isAvailable ? (
        <span style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'green',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '0.8em'
        }}>
          In Stock
        </span>
      ) : (
        <span style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'red',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '0.8em'
        }}>
          Out of Stock
        </span>
      )}

      {isNew && (
        <span style={{
          position: 'absolute',
          top: '40px',
          right: '10px',
          backgroundColor: 'blue',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '0.8em'
        }}>
          New Arrival
        </span>
      )}

      {hasDiscount && (
        <span style={{
          position: 'absolute',
          top: '70px',
          right: '10px',
          backgroundColor: 'orange',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '0.8em'
        }}>
          Sale!
        </span>
      )}

      <h3>{product.name}</h3>
      <p>
        {hasDiscount && <span style={{ textDecoration: 'line-through', marginRight: '5px' }}>${product.originalPrice.toFixed(2)}</span>}
        ${product.price.toFixed(2)}
      </p>
      <button style={{
        backgroundColor: '#0070f3',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px'
      }}>
        View Details
      </button>
    </div>
  );
}

export default ProductCard;
```

**Expected Outcome:**

Your refactored `ProductCard` component should:
*   Use clear, small helper functions or sub-components (e.g., `ProductStatusBadge`, `ProductTag`) to determine and display product status (in stock, new, sale).
*   Have a cleaner `return` statement, making the JSX more readable and less cluttered with conditional logic.
*   Be easier to extend with new product badges or display conditions without significantly increasing its complexity.

## References

[1] KISS principle. Wikipedia. URL: https://en.wikipedia.org/wiki/KISS_principle




## SOLID Principles Exercises

### 1. Principle Introduction

SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable. These principles were promoted by Robert C. Martin (also known as Uncle Bob) [1]. Adhering to SOLID principles helps in creating robust and scalable e-commerce applications.

### Single Responsibility Principle (SRP)

**Core Concept:** The Single Responsibility Principle states that a class should have only one reason to change [2]. This means a class or module should have only one primary responsibility, and all its methods should contribute to that single responsibility. If a class has more than one responsibility, changes to one responsibility might affect the others, leading to unexpected side effects and increased coupling.

**Importance in E-commerce:** In an e-commerce application, SRP is crucial for:
*   **Modularity:** Breaking down complex systems into smaller, focused components.
*   **Maintainability:** Changes to one part of the system are less likely to impact unrelated parts.
*   **Testability:** Classes with a single responsibility are easier to test in isolation.
*   **Readability:** Clearly defined responsibilities make the codebase easier to understand.

### 2. Python SRP Exercises: User Management

### Scenario: Overloaded User Class

In many applications, a `User` class or service might accumulate responsibilities beyond just managing user data. For instance, it might handle user authentication, sending email notifications, and even logging user activity. This violates SRP because changes to any of these unrelated responsibilities would require modifying the `User` class.

### "Before" Scenario (Problematic Code - Python)

Consider a `UserService` class that handles user creation, authentication, and also sends welcome emails and logs events.

```python
# services/user_service.py (Problematic - Before SRP)

class UserService:
    def create_user(self, username, email, password):
        # 1. User creation logic
        print(f"Creating user: {username} with email {email}")
        # Simulate saving to DB
        user_id = 123

        # 2. Send welcome email (Responsibility 2)
        self._send_welcome_email(email, username)

        # 3. Log user creation event (Responsibility 3)
        self._log_event(f"User {username} created")

        return {"user_id": user_id, "message": "User created successfully"}

    def authenticate_user(self, email, password):
        # 1. Authentication logic
        print(f"Authenticating user: {email}")
        # Simulate checking credentials
        if email == "test@example.com" and password == "password123":
            self._log_event(f"User {email} authenticated")
            return {"status": "success", "user_id": 1}
        else:
            self._log_event(f"Failed authentication for {email}")
            return {"status": "failure", "message": "Invalid credentials"}

    def _send_welcome_email(self, email, username):
        # Logic to send email
        print(f"Sending welcome email to {email} for {username}")

    def _log_event(self, event_message):
        # Logic to log events
        print(f"LOG: {event_message}")

# Example Usage:
user_service = UserService()
user_service.create_user("alice", "alice@example.com", "securepass")
user_service.authenticate_user("test@example.com", "password123")
user_service.authenticate_user("wrong@example.com", "wrongpass")
```

**Comments on the Problematic Code:**
*   The `UserService` class has multiple reasons to change:
    *   Changes to user creation/authentication logic.
    *   Changes to email sending mechanism (e.g., switching email providers, changing template).
    *   Changes to logging mechanism (e.g., logging to a file vs. a database vs. a third-party service).
*   This tight coupling makes the class harder to maintain and test. For example, to test user creation, you also implicitly test email sending and logging.

### "After" Scenario (Improved Code - Python)

To adhere to SRP, we can separate the responsibilities into distinct classes: `UserService` for user-related business logic, `EmailService` for sending emails, and `Logger` for logging events.

```python
# services/user_service.py (After SRP)
from services.email_service import EmailService
from utils.logger import Logger

class UserService:
    def __init__(self, email_service: EmailService, logger: Logger):
        self.email_service = email_service
        self.logger = logger

    def create_user(self, username, email, password):
        # User creation logic
        print(f"Creating user: {username} with email {email}")
        # Simulate saving to DB
        user_id = 123

        self.email_service.send_welcome_email(email, username)
        self.logger.log_event(f"User {username} created")

        return {"user_id": user_id, "message": "User created successfully"}

    def authenticate_user(self, email, password):
        # Authentication logic
        print(f"Authenticating user: {email}")
        # Simulate checking credentials
        if email == "test@example.com" and password == "password123":
            self.logger.log_event(f"User {email} authenticated")
            return {"status": "success", "user_id": 1}
        else:
            self.logger.log_event(f"Failed authentication for {email}")
            return {"status": "failure", "message": "Invalid credentials"}

# services/email_service.py
class EmailService:
    def send_welcome_email(self, email, username):
        print(f"Sending welcome email to {email} for {username}")

# utils/logger.py
class Logger:
    def log_event(self, event_message):
        print(f"LOG: {event_message}")

# main.py (or application entry point)
from services.user_service import UserService
from services.email_service import EmailService
from utils.logger import Logger

email_service = EmailService()
logger = Logger()
user_service = UserService(email_service, logger)

user_service.create_user("bob", "bob@example.com", "anotherpass")
user_service.authenticate_user("test@example.com", "password123")
```

**Comments on the Improved Code:**
*   `UserService` now solely focuses on user-related business logic.
*   `EmailService` is responsible only for sending emails.
*   `Logger` is responsible only for logging.
*   Each class has only one reason to change, making the system more modular and easier to maintain. Dependencies are injected, which also helps with testability.

### Exercise: Apply SRP to Product Management (Python)

**Task:** In an e-commerce system, managing products involves several distinct responsibilities: handling product data (CRUD operations), managing product images (upload, resize, store), and generating product SEO metadata. Your task is to refactor the following problematic `ProductManager` class to adhere to the SRP.

**Instructions:**
1.  Identify the distinct responsibilities within the `ProductManager` class.
2.  Create separate classes for each identified responsibility (e.g., `ProductRepository`, `ProductImageManager`, `ProductSeoGenerator`).
3.  Modify the `ProductManager` (or a new `ProductService`) to orchestrate these new, single-responsibility classes.

**Problematic Code (Python - `services/product_manager.py`):

```python
# services/product_manager.py (Problematic - Before SRP)

class ProductManager:
    def create_product(self, name, description, price, stock, image_file):
        print(f"Creating product: {name}")
        # 1. Save product data to DB (Responsibility 1)
        product_id = 456

        # 2. Handle image upload and processing (Responsibility 2)
        self._upload_product_image(product_id, image_file)

        # 3. Generate SEO friendly URL and meta description (Responsibility 3)
        seo_url = self._generate_seo_url(name)
        meta_description = self._generate_meta_description(description)

        print(f"Product {name} created with ID {product_id}, SEO URL: {seo_url}")
        return {"product_id": product_id, "seo_url": seo_url}

    def get_product(self, product_id):
        # Retrieve product from DB
        print(f"Fetching product {product_id}")
        return {"id": product_id, "name": "Sample Product"}

    def _upload_product_image(self, product_id, image_file):
        print(f"Uploading image {image_file.name} for product {product_id}")
        # Simulate image processing and storage

    def _generate_seo_url(self, product_name):
        return product_name.lower().replace(" ", "-")

    def _generate_meta_description(self, description):
        return description[:150] + "..." if len(description) > 150 else description

# Example Usage:
class MockImageFile:
    def __init__(self, name):
        self.name = name

product_manager = ProductManager()
product_manager.create_product("Fancy T-Shirt", "A very fancy t-shirt made of organic cotton.", 25.99, 100, MockImageFile("tshirt.jpg"))
```

**Expected Outcome:**

Your refactored code should:
*   Have separate classes for product data persistence, image management, and SEO generation.
*   The `ProductManager` (or a new service class) should coordinate these specialized classes.
*   Each new class should have a single, clear responsibility.

### 3. Node.js/Next.js SRP Exercises: API Request Handling

### Scenario: Overloaded API Route Handler

In a Next.js API route, it's common to handle incoming requests. However, a single handler function can quickly become overloaded if it's responsible for parsing request data, validating it, interacting with a database, and then formatting the response. This violates SRP.

### "Before" Scenario (Problematic Code - Node.js/Next.js)

Consider an API route for creating a new product that directly handles all these concerns within its `handler` function.

```javascript
// pages/api/products/create.js (Problematic - Before SRP)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, description, price, stock } = req.body;

  // 1. Input Validation (Responsibility 1)
  if (!name || !description || !price || !stock) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (typeof name !== 'string' || name.length < 3) {
    return res.status(400).json({ message: 'Name must be a string of at least 3 characters' });
  }
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'Price must be a positive number' });
  }
  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ message: 'Stock must be a non-negative number' });
  }

  try {
    // 2. Database Interaction (Responsibility 2)
    // Simulate saving product to a database
    const newProduct = {
      id: Date.now().toString(), // Simple ID generation
      name,
      description,
      price,
      stock,
      createdAt: new Date().toISOString(),
    };
    // In a real app, you'd interact with a DB client here
    console.log('Saving product to DB:', newProduct);

    // 3. Response Formatting (Responsibility 3)
    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// Example Usage (e.g., using fetch in a client-side component or Postman):
// fetch('/api/products/create', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ name: 'New Gadget', description: 'Cool new item', price: 99.99, stock: 50 })
// });
```

**Comments on the Problematic Code:**
*   The `handler` function is responsible for input validation, database operations, and HTTP response handling.
*   Any change to validation rules, database schema, or response format would require modifying this single function.
*   This makes the function long, hard to read, and difficult to test in isolation.

### "After" Scenario (Improved Code - Node.js/Next.js)

To apply SRP, we can separate these concerns into distinct modules or functions: a validation utility, a service layer for database interaction, and a response utility.

```javascript
// utils/productValidation.js
export function validateProductInput(data) {
  const errors = {};
  if (!data.name || typeof data.name !== 'string' || data.name.length < 3) {
    errors.name = 'Name must be a string of at least 3 characters';
  }
  if (typeof data.price !== 'number' || data.price <= 0) {
    errors.price = 'Price must be a positive number';
  }
  if (typeof data.stock !== 'number' || data.stock < 0) {
    errors.stock = 'Stock must be a non-negative number';
  }
  // Add more validation rules as needed
  return errors;
}

// services/productService.js
export class ProductService {
  constructor(dbClient) {
    this.dbClient = dbClient; // In a real app, this would be a database client
  }

  async createProduct(productData) {
    // Simulate saving product to a database
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString(),
    };
    console.log('Saving product to DB:', newProduct);
    // await this.dbClient.save(newProduct);
    return newProduct;
  }

  async getProductById(id) {
    // Simulate fetching product from DB
    console.log(`Fetching product with ID: ${id}`);
    // return await this.dbClient.findById(id);
    return { id, name: 'Fetched Product', price: 100, stock: 10 }; // Mock data
  }
}

// utils/apiResponse.js (re-using from DRY exercise, or define if not present)
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const errorResponse = (res, error, message = 'An error occurred', statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error,
    message,
  });
};

export const methodNotAllowed = (res, method) => {
  errorResponse(res, 'Method Not Allowed', `Method ${method} not allowed for this route`, 405);
};

// pages/api/products/create.js (After SRP)
import { validateProductInput } from '../../../utils/productValidation';
import { ProductService } from '../../../services/productService';
import { successResponse, errorResponse, methodNotAllowed } from '../../../utils/apiResponse';

// In a real app, you'd initialize dbClient once and pass it around
const productService = new ProductService({}); // Mock dbClient

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, req.method);
  }

  const validationErrors = validateProductInput(req.body);
  if (Object.keys(validationErrors).length > 0) {
    return errorResponse(res, validationErrors, 'Validation Failed', 400);
  }

  try {
    const newProduct = await productService.createProduct(req.body);
    successResponse(res, newProduct, 'Product created successfully', 201);
  } catch (error) {
    console.error('Error creating product:', error);
    errorResponse(res, 'Internal Server Error', 'Failed to create product', 500);
  }
}
```

**Comments on the Improved Code:**
*   `validateProductInput` handles only input validation.
*   `ProductService` handles only business logic and database interactions.
*   `apiResponse` utilities handle only HTTP response formatting.
*   The API route handler now orchestrates these specialized modules, making it much cleaner, more readable, and easier to maintain. Each component can be tested independently.

### Exercise: Apply SRP to Frontend User Profile Display (Node.js/Next.js)

**Task:** In a Next.js e-commerce frontend, a user profile page might display user details, a list of their recent orders, and notifications. A single `UserProfilePage` component that fetches all this data and renders it directly violates SRP. Your task is to refactor this component to adhere to SRP.

**Instructions:**
1.  Identify the distinct responsibilities within the `UserProfilePage` component (e.g., fetching user data, fetching order data, fetching notifications).
2.  Create separate, smaller components or custom hooks for each responsibility (e.g., `UserDetails`, `UserOrdersList`, `UserNotifications`). These components should be responsible for fetching and displaying their own data.
3.  Modify the `UserProfilePage` to compose these smaller, single-responsibility components.

**Problematic Code (Node.js/Next.js - `pages/profile.js`):

```javascript
// pages/profile.js (Problematic - Before SRP)

import React, { useEffect, useState } from 'react';

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user data (Responsibility 1)
        const userRes = await fetch('/api/user/me');
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();
        setUser(userData.data);

        // Fetch orders data (Responsibility 2)
        const ordersRes = await fetch('/api/user/orders');
        if (!ordersRes.ok) throw new Error('Failed to fetch orders');
        const ordersData = await ordersRes.json();
        setOrders(ordersData.data);

        // Fetch notifications data (Responsibility 3)
        const notificationsRes = await fetch('/api/user/notifications');
        if (!notificationsRes.ok) throw new Error('Failed to fetch notifications');
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h1>User Profile</h1>

      <section>
        <h2>Personal Details</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* ... other user details ... */}
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2>Recent Orders</h2>
        {orders.length === 0 ? (
          <p>No recent orders.</p>
        ) : (
          <ul>
            {orders.map(order => (
              <li key={order.id}>Order #{order.id} - Total: ${order.total.toFixed(2)}</li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p>No new notifications.</p>
        ) : (
          <ul>
            {notifications.map(notification => (
              <li key={notification.id}>{notification.message}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default UserProfilePage;
```

**Expected Outcome:**

Your refactored `UserProfilePage` component should:
*   Be a composition of smaller, specialized components (e.g., `UserDetails`, `UserOrdersList`, `UserNotifications`).
*   Each sub-component should be responsible for fetching and displaying its own data.
*   The `UserProfilePage` component should primarily focus on layout and orchestrating these sub-components, not on data fetching or detailed rendering logic for each section.

## References

[1] SOLID (object-oriented design). Wikipedia. URL: https://en.wikipedia.org/wiki/SOLID
[2] Single-responsibility principle. Wikipedia. URL: https://en.wikipedia.org/wiki/Single-responsibility_principle




### Open/Closed Principle (OCP)

**Core Concept:** The Open/Closed Principle states that software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification [1]. This means that you should be able to add new functionality to a system without altering existing, working code. Instead, you should extend its behavior.

**Importance in E-commerce:** OCP is particularly important in e-commerce for:
*   **Extensibility:** Easily adding new features (e.g., new payment methods, new discount types, new shipping options) without touching existing, stable code.
*   **Stability:** Reducing the risk of introducing bugs into existing functionality when new features are added.
*   **Maintainability:** Making the system easier to manage and update over time.
*   **Reduced Regression:** Less need for extensive re-testing of existing features when new ones are introduced.

### 2. Python OCP Exercises: Discount Calculation

### Scenario: New Discount Types

An e-commerce platform frequently introduces new discount types (e.g., percentage-based, fixed amount, buy-one-get-one-free, loyalty discounts). A common violation of OCP occurs when adding a new discount type requires modifying the core discount calculation logic, leading to a large, complex conditional structure.

### "Before" Scenario (Problematic Code - Python)

Consider a `DiscountCalculator` class that applies discounts based on a hardcoded set of rules. Adding a new discount type means modifying the `apply_discount` method.

```python
# services/discount_calculator.py (Problematic - Before OCP)

class DiscountCalculator:
    def apply_discount(self, order_total, discount_type, discount_value=0):
        if discount_type == "percentage":
            return order_total * (1 - discount_value / 100)
        elif discount_type == "fixed_amount":
            return max(0, order_total - discount_value)
        elif discount_type == "loyalty_points":
            # Assume 100 points = $1 discount
            discount_amount = discount_value / 100
            return max(0, order_total - discount_amount)
        else:
            return order_total

# Example Usage:
discount_calc = DiscountCalculator()
print(f"Percentage discount: {discount_calc.apply_discount(100, 'percentage', 10)}") # 10% off
print(f"Fixed amount discount: {discount_calc.apply_discount(100, 'fixed_amount', 20)}") # $20 off
print(f"Loyalty points discount: {discount_calc.apply_discount(100, 'loyalty_points', 500)}") # 500 points = $5 off

# Imagine adding a new 'buy_one_get_one_free' discount type. 
# This would require modifying the apply_discount method.
```

**Comments on the Problematic Code:**
*   The `apply_discount` method is not closed for modification. Every time a new discount type is introduced, this method needs to be altered.
*   The `if/elif` chain will grow, making the method harder to read, maintain, and test.
*   Modifying existing code increases the risk of introducing bugs into already working functionality.

### "After" Scenario (Improved Code - Python)

To adhere to OCP, we can introduce an abstraction for discounts. We'll define a base `Discount` class (or interface) and create concrete discount classes for each type. The `DiscountCalculator` will then work with these abstractions, allowing new discount types to be added without modifying the calculator itself.

```python
# discounts/base_discount.py
from abc import ABC, abstractmethod

class Discount(ABC):
    @abstractmethod
    def apply(self, order_total: float) -> float:
        pass

# discounts/percentage_discount.py
class PercentageDiscount(Discount):
    def __init__(self, percentage: float):
        self.percentage = percentage

    def apply(self, order_total: float) -> float:
        return order_total * (1 - self.percentage / 100)

# discounts/fixed_amount_discount.py
class FixedAmountDiscount(Discount):
    def __init__(self, amount: float):
        self.amount = amount

    def apply(self, order_total: float) -> float:
        return max(0, order_total - self.amount)

# discounts/loyalty_points_discount.py
class LoyaltyPointsDiscount(Discount):
    def __init__(self, points: int):
        self.points = points

    def apply(self, order_total: float) -> float:
        discount_amount = self.points / 100  # Assume 100 points = $1
        return max(0, order_total - discount_amount)

# services/discount_calculator.py (After OCP)
class DiscountCalculator:
    def apply_discounts(self, order_total: float, discounts: list[Discount]) -> float:
        current_total = order_total
        for discount in discounts:
            current_total = discount.apply(current_total)
        return current_total

# Example Usage:
from discounts.percentage_discount import PercentageDiscount
from discounts.fixed_amount_discount import FixedAmountDiscount
from discounts.loyalty_points_discount import LoyaltyPointsDiscount

discount_calc = DiscountCalculator()

# Apply multiple discounts
discounts_for_order = [
    PercentageDiscount(10),  # 10% off
    FixedAmountDiscount(5),   # $5 off
]
print(f"Combined discounts: {discount_calc.apply_discounts(100, discounts_for_order)}")

# Adding a new discount type (e.g., BuyOneGetOneFreeDiscount) 
# would not require changing DiscountCalculator or existing discount classes.
# You just create a new class inheriting from Discount.

new_discount = LoyaltyPointsDiscount(500)
print(f"New loyalty discount: {new_discount.apply(100)}")
```

**Comments on the Improved Code:**
*   The `Discount` abstract base class defines a contract (`apply` method) for all discount types.
*   Each specific discount type (e.g., `PercentageDiscount`, `FixedAmountDiscount`) implements this contract.
*   The `DiscountCalculator` is now closed for modification; it operates on a list of `Discount` objects, regardless of their concrete type.
*   To add a new discount type, you simply create a new class that inherits from `Discount` and implement its `apply` method. No changes are needed in `DiscountCalculator` or existing discount classes.

### Exercise: Apply OCP to Shipping Cost Calculation (Python)

**Task:** An e-commerce platform needs to calculate shipping costs based on various factors, such as destination (domestic, international), shipping speed (standard, express), and product weight/dimensions. Currently, the `ShippingCalculator` has a single method with a large conditional structure to determine the cost. Your task is to refactor this to adhere to the OCP.

**Instructions:**
1.  Define an abstract base class `ShippingStrategy` with an `abstractmethod` for `calculate_cost`.
2.  Create concrete implementations of `ShippingStrategy` for different shipping scenarios (e.g., `StandardDomesticShipping`, `ExpressInternationalShipping`, `WeightBasedShipping`).
3.  Modify the `ShippingCalculator` to accept and use instances of `ShippingStrategy`, allowing new strategies to be added without modifying the calculator itself.

**Problematic Code (Python - `services/shipping_calculator.py`):

```python
# services/shipping_calculator.py (Problematic - Before OCP)

class ShippingCalculator:
    def calculate_shipping_cost(self, order_items, destination_type, speed):
        base_cost = 5.0
        total_weight = sum(item["weight"] * item["quantity"] for item in order_items)

        if destination_type == "domestic":
            if speed == "standard":
                cost = base_cost + (total_weight * 0.5)
            elif speed == "express":
                cost = base_cost + 10 + (total_weight * 1.0)
            else:
                cost = base_cost
        elif destination_type == "international":
            if speed == "standard":
                cost = base_cost + 15 + (total_weight * 2.0)
            elif speed == "express":
                cost = base_cost + 30 + (total_weight * 3.0)
            else:
                cost = base_cost + 15
        else:
            cost = base_cost

        # Additional complex rules might be added here for specific regions, product types, etc.

        return round(cost, 2)

# Example Usage:
items = [{"name": "Book", "weight": 0.5, "quantity": 2}, {"name": "Mug", "weight": 0.3, "quantity": 1}]
shipping_calc = ShippingCalculator()
print(f"Domestic Standard: {shipping_calc.calculate_shipping_cost(items, 'domestic', 'standard')}")
print(f"International Express: {shipping_calc.calculate_shipping_cost(items, 'international', 'express')}")
```

**Expected Outcome:**

Your refactored code should:
*   Have a `ShippingStrategy` abstract base class.
*   Implement concrete shipping strategy classes (e.g., `DomesticStandardShippingStrategy`, `InternationalExpressShippingStrategy`).
*   The `ShippingCalculator` should accept a `ShippingStrategy` object and delegate the cost calculation to it, making it extensible without modification.

### 3. Node.js/Next.js OCP Exercises: UI Component Rendering

### Scenario: Dynamic Content Blocks on Product Page

An e-commerce product detail page often displays various content blocks (e.g., product description, specifications, reviews, related products, FAQs). A common OCP violation occurs when the rendering logic for these blocks is hardcoded within the main product page component, requiring modification every time a new type of content block is introduced.

### "Before" Scenario (Problematic Code - Node.js/Next.js)

Consider a `ProductDetailPage` component that uses a large `switch` statement or multiple `if/else` conditions to render different sections based on a `sectionType` property.

```javascript
// components/ProductDetailPage.js (Problematic - Before OCP)

import React from 'react';

function ProductDetailPage({ product, sections }) {
  const renderSection = (section) => {
    switch (section.type) {
      case 'description':
        return (
          <div key={section.id}>
            <h2>Product Description</h2>
            <p>{section.content}</p>
          </div>
        );
      case 'specifications':
        return (
          <div key={section.id}>
            <h2>Specifications</h2>
            <ul>
              {Object.entries(section.content).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {String(value)}</li>
              ))}
            </ul>
          </div>
        );
      case 'reviews':
        return (
          <div key={section.id}>
            <h2>Customer Reviews</h2>
            {section.content.map(review => (
              <div key={review.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                <p><strong>{review.author}</strong> ({review.rating}/5)</p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        );
      // Adding a new section type (e.g., 'related_products') would require modifying this switch statement.
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '960px', margin: 'auto' }}>
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', height: 'auto' }} />
      <p>Price: ${product.price.toFixed(2)}</p>

      {sections.map(section => renderSection(section))}
    </div>
  );
}

export default ProductDetailPage;

// Example Usage (in a parent component or page):
// const productData = { name: 'Smartwatch', price: 199.99, imageUrl: '/smartwatch.jpg' };
// const productSections = [
//   { id: 1, type: 'description', content: 'A feature-rich smartwatch with health tracking.' },
//   { id: 2, type: 'specifications', content: { display: 'AMOLED', battery: '200mAh' } },
//   { id: 3, type: 'reviews', content: [
//     { id: 1, author: 'Alice', rating: 5, comment: 'Great product!' },
//     { id: 2, author: 'Bob', rating: 4, comment: 'Good value for money.' }
//   ]},
// ];
// <ProductDetailPage product={productData} sections={productSections} />
```

**Comments on the Problematic Code:**
*   The `renderSection` function is not closed for modification. Any new section type requires adding a new `case` to the `switch` statement.
*   This makes the component less flexible and harder to maintain as the number of section types grows.
*   It violates OCP by forcing changes to existing code for new functionality.

### "After" Scenario (Improved Code - Node.js/Next.js)

To adhere to OCP, we can use a strategy pattern or a component mapping approach. We'll create separate components for each section type and dynamically render them based on a registry or map. This allows new section components to be added without modifying the `ProductDetailPage`.

```javascript
// components/ProductDescription.js
import React from 'react';
const ProductDescription = ({ content }) => (
  <div>
    <h2>Product Description</h2>
    <p>{content}</p>
  </div>
);
export default ProductDescription;

// components/ProductSpecifications.js
import React from 'react';
const ProductSpecifications = ({ content }) => (
  <div>
    <h2>Specifications</h2>
    <ul>
      {Object.entries(content).map(([key, value]) => (
        <li key={key}><strong>{key}:</strong> {String(value)}</li>
      ))}
    </ul>
  </div>
);
export default ProductSpecifications;

// components/ProductReviews.js
import React from 'react';
const ProductReviews = ({ content }) => (
  <div>
    <h2>Customer Reviews</h2>
    {content.map(review => (
      <div key={review.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
        <p><strong>{review.author}</strong> ({review.rating}/5)</p>
        <p>{review.comment}</p>
      </div>
    ))}
  </div>
);
export default ProductReviews;

// components/ProductSectionMap.js
import ProductDescription from './ProductDescription';
import ProductSpecifications from './ProductSpecifications';
import ProductReviews from './ProductReviews';

const ProductSectionMap = {
  description: ProductDescription,
  specifications: ProductSpecifications,
  reviews: ProductReviews,
  // New section types can be added here without modifying ProductDetailPage
};

export default ProductSectionMap;

// components/ProductDetailPage.js (After OCP)
import React from 'react';
import ProductSectionMap from './ProductSectionMap';

function ProductDetailPage({ product, sections }) {
  return (
    <div style={{ padding: '20px', maxWidth: '960px', margin: 'auto' }}>
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', height: 'auto' }} />
      <p>Price: ${product.price.toFixed(2)}</p>

      {sections.map(section => {
        const SectionComponent = ProductSectionMap[section.type];
        return SectionComponent ? <SectionComponent key={section.id} {...section} /> : null;
      })}
    </div>
  );
}

export default ProductDetailPage;
```

**Comments on the Improved Code:**
*   Each content block type (description, specifications, reviews) is now its own dedicated React component.
*   `ProductSectionMap` acts as a registry, mapping section types to their corresponding components.
*   `ProductDetailPage` is now closed for modification. To add a new section type, you simply create a new component and add it to `ProductSectionMap`. The `ProductDetailPage` component does not need to be changed.
*   This approach makes the UI highly extensible and maintainable.

## References

[1] Open/closed principle. Wikipedia. URL: https://en.wikipedia.org/wiki/Open/closed_principle




### Liskov Substitution Principle (LSP)

**Core Concept:** The Liskov Substitution Principle states that objects of a superclass should be replaceable with objects of its subclasses without breaking the application [1]. This means that if a program is using a base class, it should be able to use any of its derived classes without knowing it, and the program should still function correctly. It emphasizes behavioral subtyping, ensuring that subclasses do not violate the expectations set by their superclass.

**Importance in E-commerce:** LSP is vital in e-commerce for:
*   **Robustness:** Ensuring that new product types, payment methods, or user roles can be introduced without causing unexpected behavior in existing code.
*   **Flexibility:** Allowing for polymorphic behavior, where different implementations can be used interchangeably.
*   **Maintainability:** Reducing the risk of breaking existing functionality when extending the system with new subclasses.
*   **Testability:** Making it easier to test components that rely on abstractions, as any valid subclass can be used for testing.

### 2. Python LSP Exercises: Product Types

### Scenario: Product Type Behavior

In an e-commerce system, there might be different types of products (e.g., `PhysicalProduct`, `DigitalProduct`, `ServiceProduct`). A common LSP violation occurs when a subclass changes the expected behavior of the base class in a way that breaks client code that expects the base class behavior. For example, a `DigitalProduct` might incorrectly implement a `calculate_shipping_cost` method, or a `ServiceProduct` might have a `stock` attribute that doesn't make sense.

### "Before" Scenario (Problematic Code - Python)

Consider a base `Product` class with a `get_details` method and subclasses that might violate its contract.

```python
# models/product.py (Problematic - Before LSP)

class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def get_details(self):
        return f"Product: {self.name}, Price: ${self.price:.2f}"

    def calculate_shipping_cost(self):
        # This method is not relevant for all product types
        return 5.0 # Default shipping cost

class PhysicalProduct(Product):
    def __init__(self, name, price, weight):
        super().__init__(name, price)
        self.weight = weight

    def get_details(self):
        return f"Physical Product: {self.name}, Price: ${self.price:.2f}, Weight: {self.weight}kg"

    def calculate_shipping_cost(self):
        return 5.0 + (self.weight * 2.0)

class DigitalProduct(Product):
    def __init__(self, name, price, download_link):
        super().__init__(name, price)
        self.download_link = download_link

    def get_details(self):
        return f"Digital Product: {self.name}, Price: ${self.price:.2f}, Link: {self.download_link}"

    def calculate_shipping_cost(self):
        # This method is not applicable, but still implemented
        return 0.0 # Digital products have no shipping cost

class ServiceProduct(Product):
    def __init__(self, name, price, duration_hours):
        super().__init__(name, price)
        self.duration_hours = duration_hours

    def get_details(self):
        return f"Service Product: {self.name}, Price: ${self.price:.2f}, Duration: {self.duration_hours} hours"

    def calculate_shipping_cost(self):
        # This method is also not applicable
        raise NotImplementedError("Service products do not have shipping costs")

# Function that processes products, expecting base Product behavior
def process_products_for_shipping(products):
    total_shipping = 0
    for product in products:
        # This will break for ServiceProduct, violating LSP
        total_shipping += product.calculate_shipping_cost()
    return total_shipping

# Example Usage:
physical_book = PhysicalProduct("Python Book", 30.00, 1.2)
digital_ebook = DigitalProduct("Python Ebook", 15.00, "http://example.com/ebook.pdf")
consulting_service = ServiceProduct("Consulting Hour", 100.00, 1)

all_products = [physical_book, digital_ebook]
print(f"Total shipping for physical and digital: {process_products_for_shipping(all_products)}")

# This will cause an error due to LSP violation:
# print(f"Total shipping for all products: {process_products_for_shipping([physical_book, digital_ebook, consulting_service])}")
```

**Comments on the Problematic Code:**
*   The `Product` base class defines `calculate_shipping_cost`, implying that all products have shipping costs. This is not true for `DigitalProduct` or `ServiceProduct`.
*   `DigitalProduct` returns `0.0` for shipping, which is a valid number but semantically incorrect (it doesn't *have* shipping, it's not *free* shipping).
*   `ServiceProduct` raises a `NotImplementedError`, which breaks the `process_products_for_shipping` function when it encounters a `ServiceProduct`. This is a clear violation of LSP, as `ServiceProduct` cannot be substituted for `Product` without breaking client code.
*   Client code (`process_products_for_shipping`) expects `calculate_shipping_cost` to always return a number, but `ServiceProduct` violates this expectation.

### "After" Scenario (Improved Code - Python)

To adhere to LSP, we should ensure that subclasses can be substituted for their superclass without altering the correctness of the program. This often means designing interfaces (or abstract base classes) that only include methods relevant to *all* concrete implementations. For shipping, we can introduce a separate interface or a mechanism to check if a product is shippable.

```python
# models/product.py (After LSP)
from abc import ABC, abstractmethod

class Product(ABC):
    def __init__(self, name, price):
        self.name = name
        self.price = price

    @abstractmethod
    def get_details(self):
        pass

class ShippableProduct(ABC):
    @abstractmethod
    def calculate_shipping_cost(self) -> float:
        pass

class PhysicalProduct(Product, ShippableProduct):
    def __init__(self, name, price, weight):
        super().__init__(name, price)
        self.weight = weight

    def get_details(self):
        return f"Physical Product: {self.name}, Price: ${self.price:.2f}, Weight: {self.weight}kg"

    def calculate_shipping_cost(self):
        return 5.0 + (self.weight * 2.0)

class DigitalProduct(Product):
    def __init__(self, name, price, download_link):
        super().__init__(name, price)
        self.download_link = download_link

    def get_details(self):
        return f"Digital Product: {self.name}, Price: ${self.price:.2f}, Link: {self.download_link}"

class ServiceProduct(Product):
    def __init__(self, name, price, duration_hours):
        super().__init__(name, price)
        self.duration_hours = duration_hours

    def get_details(self):
        return f"Service Product: {self.name}, Price: ${self.price:.2f}, Duration: {self.duration_hours} hours"

# Function that processes products for shipping, now respecting LSP
def process_products_for_shipping(products: list[Product]):
    total_shipping = 0.0
    for product in products:
        if isinstance(product, ShippableProduct):
            total_shipping += product.calculate_shipping_cost()
        else:
            print(f"Product \'{product.name}\' is not shippable, skipping shipping cost calculation.")
    return total_shipping

# Example Usage:
physical_book = PhysicalProduct("Python Book", 30.00, 1.2)
digital_ebook = DigitalProduct("Python Ebook", 15.00, "http://example.com/ebook.pdf")
consulting_service = ServiceProduct("Consulting Hour", 100.00, 1)

all_products = [physical_book, digital_ebook, consulting_service]
print(f"Total shipping for all products: {process_products_for_shipping(all_products)}")

# You can also use type hints for clarity:
# def process_shippable_products(products: list[ShippableProduct]):
#     total_shipping = 0.0
#     for product in products:
#         total_shipping += product.calculate_shipping_cost()
#     return total_shipping
# print(f"Total shipping for shippable products only: {process_shippable_products([physical_book])}")
```

**Comments on the Improved Code:**
*   We introduced a `ShippableProduct` abstract base class (acting as an interface) that defines the `calculate_shipping_cost` method.
*   Only `PhysicalProduct` inherits from `ShippableProduct`, explicitly stating that it is the only product type that has shipping costs.
*   `DigitalProduct` and `ServiceProduct` do not implement `calculate_shipping_cost`, as it's not applicable to them.
*   The `process_products_for_shipping` function now checks if a product is an instance of `ShippableProduct` before attempting to calculate shipping. This ensures that the program behaves correctly for all product types, adhering to LSP.
*   Client code can now safely operate on a collection of `Product` objects, and the behavior for shipping will be correct and predictable.

### Exercise: Apply LSP to Payment Gateway Integration (Python)

**Task:** An e-commerce system integrates with various payment gateways (e.g., `CreditCardGateway`, `PayPalGateway`, `StripeGateway`). A common LSP violation occurs when a payment gateway implementation behaves unexpectedly or fails to fulfill the contract defined by a common `PaymentGateway` interface. Your task is to refactor the following code to ensure LSP compliance.

**Instructions:**
1.  Define an abstract base class `PaymentGateway` with an `abstractmethod` for `process_payment`.
2.  Create concrete implementations for `CreditCardGateway` and `PayPalGateway`.
3.  Introduce a problematic `GiftCardGateway` that violates LSP by not handling negative amounts correctly or by having a different return type for `process_payment`.
4.  Refactor the `process_order_payment` function to demonstrate how LSP is maintained (or violated) and how to handle it correctly.

**Problematic Code (Python - `services/payment_service.py`):

```python
# services/payment_service.py (Problematic - Before LSP)

class PaymentGateway:
    def process_payment(self, amount, payment_details):
        # Base method, assumes all gateways handle positive amounts
        if amount <= 0:
            raise ValueError("Payment amount must be positive")
        print(f"Processing generic payment of ${amount:.2f}")
        return {"status": "success", "transaction_id": "GENERIC_123"}

class CreditCardGateway(PaymentGateway):
    def process_payment(self, amount, payment_details):
        # Specific credit card processing logic
        print(f"Processing credit card payment of ${amount:.2f} for card ending in {payment_details.get("card_number", "")[-4:]}")
        return {"status": "success", "transaction_id": "CC_456"}

class PayPalGateway(PaymentGateway):
    def process_payment(self, amount, payment_details):
        # Specific PayPal processing logic
        print(f"Processing PayPal payment of ${amount:.2f} for email {payment_details.get("paypal_email")}")
        return {"status": "success", "transaction_id": "PP_789"}

class GiftCardGateway(PaymentGateway):
    def process_payment(self, amount, payment_details):
        # Problematic implementation: Gift cards can have negative balance adjustments
        # and might return a different structure or raise different errors.
        gift_card_balance = payment_details.get("balance", 0)
        if gift_card_balance < amount:
            return {"status": "failed", "message": "Insufficient gift card balance"}
        new_balance = gift_card_balance - amount
        print(f"Processing gift card payment of ${amount:.2f}. New balance: ${new_balance:.2f}")
        return {"status": "success", "remaining_balance": new_balance} # Different return key

def process_order_payment(gateway: PaymentGateway, amount: float, details: dict):
    try:
        result = gateway.process_payment(amount, details)
        # Client code expects 'transaction_id' key
        if result["status"] == "success" and "transaction_id" in result:
            print(f"Payment successful! Transaction ID: {result["transaction_id"]}")
        elif result["status"] == "success" and "remaining_balance" in result: # Ad-hoc check for GiftCardGateway
            print(f"Gift card payment successful! Remaining balance: {result["remaining_balance"]}")
        else:
            print(f"Payment failed: {result.get("message", "Unknown error")}")
    except ValueError as e:
        print(f"Payment error: {e}")
    except NotImplementedError as e:
        print(f"Payment error: {e}")

# Example Usage:
credit_card_gateway = CreditCardGateway()
paypal_gateway = PayPalGateway()
gift_card_gateway = GiftCardGateway()

process_order_payment(credit_card_gateway, 50.00, {"card_number": "1234567890123456"})
process_order_payment(paypal_gateway, 75.50, {"paypal_email": "user@example.com"})
process_order_payment(gift_card_gateway, 25.00, {"balance": 100.00})
process_order_payment(gift_card_gateway, 150.00, {"balance": 50.00})
```

**Expected Outcome:**

Your refactored code should:
*   Ensure that all `PaymentGateway` subclasses adhere to a consistent contract for `process_payment` (e.g., always returning a dictionary with at least `status` and `transaction_id` or `error_message`).
*   Modify `GiftCardGateway` to fit this contract, perhaps by issuing a unique transaction ID even for balance adjustments.
*   The `process_order_payment` function should be able to process payments using any `PaymentGateway` subclass without needing special checks for specific types, demonstrating LSP.

### 3. Node.js/Next.js LSP Exercises: Notification System

### Scenario: Inconsistent Notification Channels

An e-commerce application needs to send various notifications (e.g., order confirmation, shipping updates, promotional messages) through different channels (email, SMS, push notifications). A common LSP violation occurs when different notification channel implementations have inconsistent interfaces or unexpected side effects, breaking a generic notification sending mechanism.

### "Before" Scenario (Problematic Code - Node.js/Next.js)

Consider a base `NotificationChannel` class and subclasses that might violate its contract.

```javascript
// services/notificationService.js (Problematic - Before LSP)

class NotificationChannel {
  send(recipient, message) {
    console.log(`Sending generic notification to ${recipient}: ${message}`);
    return { success: true, channel: "generic" };
  }
}

class EmailChannel extends NotificationChannel {
  send(recipient, message, subject) { // Adds an extra parameter
    console.log(`Sending email to ${recipient} with subject "${subject}": ${message}`);
    return { success: true, channel: "email", emailSent: true };
  }
}

class SMSChannel extends NotificationChannel {
  send(recipient, message) {
    if (recipient.length !== 10 || !/^[0-9]+$/.test(recipient)) {
      throw new Error("Invalid phone number for SMS"); // Throws an unexpected error type
    }
    console.log(`Sending SMS to ${recipient}: ${message}`);
    return { success: true, channel: "sms", smsSent: true };
  }
}

class PushNotificationChannel extends NotificationChannel {
  send(recipient, message) {
    // This channel might return a Promise, changing the expected sync behavior
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Sending push notification to device ${recipient}: ${message}`);
        resolve({ success: true, channel: "push", pushSent: true });
      }, 100);
    });
  }
}

// Function that sends notifications, expecting base NotificationChannel behavior
async function send_notifications(channel, recipient, message) {
  try {
    const result = await channel.send(recipient, message); // Awaiting due to PushNotificationChannel
    if (result.success) {
      console.log(`Notification sent successfully via ${result.channel}`);
    } else {
      console.error(`Failed to send notification via ${result.channel}: ${result.message}`);
    }
  } catch (error) {
    console.error(`Error sending notification: ${error.message}`);
  }
}

// Example Usage:
const emailChannel = new EmailChannel();
const smsChannel = new SMSChannel();
const pushChannel = new PushNotificationChannel();

// This works, but EmailChannel's extra 'subject' parameter is ignored by the generic call
send_notifications(emailChannel, "user@example.com", "Your order #123 has shipped.");

// This will throw an error for invalid recipient, breaking the generic function
// send_notifications(smsChannel, "123", "Your order is on its way.");

// This works, but the generic function needs to be 'async' to handle the Promise
send_notifications(pushChannel, "device_token_abc", "New promotion available!");
```

**Comments on the Problematic Code:**
*   `EmailChannel` adds an extra parameter (`subject`) to `send`, which is ignored by the generic `send_notifications` function, leading to a potential loss of functionality or confusion.
*   `SMSChannel` throws a specific `Error` type for invalid input, which might not be handled gracefully by generic error catching that expects a specific return structure.
*   `PushNotificationChannel` returns a `Promise`, changing the synchronous expectation of the base `send` method, forcing the client function (`send_notifications`) to become `async`.
*   These inconsistencies violate LSP, as the subclasses cannot be substituted for `NotificationChannel` without potentially breaking or altering the behavior of the `send_notifications` function.

### "After" Scenario (Improved Code - Node.js/Next.js)

To adhere to LSP, we should ensure that all notification channels implement a consistent interface. This means all `send` methods should accept the same parameters and return a consistent structure (e.g., a Promise resolving to an object with `success` and `message` properties).

```javascript
// services/notificationService.js (After LSP)

class NotificationResult {
  constructor(success, message, channel) {
    this.success = success;
    this.message = message;
    this.channel = channel;
  }
}

class NotificationChannel {
  async send(recipient, message, options = {}) {
    // Base implementation, can be abstract if desired
    console.log(`Sending generic notification to ${recipient}: ${message}`);
    return new NotificationResult(true, "Generic notification sent", "generic");
  }
}

class EmailChannel extends NotificationChannel {
  async send(recipient, message, options = {}) {
    const { subject = "No Subject" } = options;
    console.log(`Sending email to ${recipient} with subject "${subject}": ${message}`);
    // Simulate async operation
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(new NotificationResult(true, "Email sent successfully", "email"));
      }, 50);
    });
  }
}

class SMSChannel extends NotificationChannel {
  async send(recipient, message, options = {}) {
    if (recipient.length !== 10 || !/^[0-9]+$/.test(recipient)) {
      return new NotificationResult(false, "Invalid phone number for SMS", "sms");
    }
    console.log(`Sending SMS to ${recipient}: ${message}`);
    // Simulate async operation
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(new NotificationResult(true, "SMS sent successfully", "sms"));
      }, 50);
    });
  }
}

class PushNotificationChannel extends NotificationChannel {
  async send(recipient, message, options = {}) {
    console.log(`Sending push notification to device ${recipient}: ${message}`);
    // Simulate async operation
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(new NotificationResult(true, "Push notification sent successfully", "push"));
      }, 100);
    });
  }
}

// Function that sends notifications, now fully respecting LSP
async function send_notifications(channel, recipient, message, options = {}) {
  try {
    const result = await channel.send(recipient, message, options);
    if (result.success) {
      console.log(`Notification sent successfully via ${result.channel}: ${result.message}`);
    } else {
      console.error(`Failed to send notification via ${result.channel}: ${result.message}`);
    }
  } catch (error) {
    console.error(`Unexpected error sending notification: ${error.message}`);
  }
}

// Example Usage:
const emailChannel = new EmailChannel();
const smsChannel = new SMSChannel();
const pushChannel = new PushNotificationChannel();

send_notifications(emailChannel, "user@example.com", "Your order #123 has shipped.", { subject: "Order Update" });
send_notifications(smsChannel, "1234567890", "Your order is on its way.");
send_notifications(smsChannel, "123", "Your order is on its way."); // This will now return a failed result gracefully
send_notifications(pushChannel, "device_token_abc", "New promotion available!");
```

**Comments on the Improved Code:**
*   All `send` methods now consistently return a `Promise` that resolves to a `NotificationResult` object, ensuring a uniform interface.
*   Extra parameters like `subject` are passed via an `options` object, maintaining a consistent method signature.
*   Validation errors (like invalid phone numbers for SMS) are now returned as part of the `NotificationResult` object with `success: false`, rather than throwing unexpected errors.
*   The `send_notifications` function can now seamlessly work with any `NotificationChannel` subclass, demonstrating LSP compliance. It doesn't need to know the specific type of channel it's interacting with.

## References

[1] Liskov substitution principle. Wikipedia. URL: https://en.wikipedia.org/wiki/Liskov_substitution_principle




### Interface Segregation Principle (ISP)

**Core Concept:** The Interface Segregation Principle states that no client should be forced to depend on methods it does not use [1]. This means that large, monolithic interfaces should be split into smaller, more specific ones, so that clients only need to know about the methods that are relevant to them. It favors composition over inheritance and promotes creating fine-grained interfaces.

**Importance in E-commerce:** ISP is crucial in e-commerce for:
*   **Decoupling:** Reducing the coupling between different parts of the system. If a class only depends on a small, specific interface, it is less affected by changes to other unrelated methods.
*   **Maintainability:** Making the system easier to understand and maintain, as classes have fewer, more focused dependencies.
*   **Testability:** Simplifying testing, as it's easier to create mock implementations for smaller interfaces.
*   **Clarity:** Providing a clearer understanding of the responsibilities of a class by looking at the interfaces it implements.

### 2. Python ISP Exercises: Admin User Permissions

### Scenario: Overly Broad Admin Interface

In an e-commerce admin panel, different types of admin users might have different responsibilities (e.g., `ProductManager`, `OrderManager`, `UserManager`). A common ISP violation is to have a single, large `IAdminActions` interface that includes methods for all possible admin tasks. This forces any class that implements the interface to provide implementations for methods it doesn't need, leading to bloated classes or methods that raise `NotImplementedError`.

### "Before" Scenario (Problematic Code - Python)

Consider a single `IAdminActions` interface that defines methods for managing products, orders, and users.

```python
# interfaces/admin_actions.py (Problematic - Before ISP)
from abc import ABC, abstractmethod

class IAdminActions(ABC):
    @abstractmethod
    def create_product(self, product_data):
        pass

    @abstractmethod
    def update_product(self, product_id, product_data):
        pass

    @abstractmethod
    def delete_product(self, product_id):
        pass

    @abstractmethod
    def get_order(self, order_id):
        pass

    @abstractmethod
    def update_order_status(self, order_id, new_status):
        pass

    @abstractmethod
    def create_user(self, user_data):
        pass

    @abstractmethod
    def delete_user(self, user_id):
        pass

# services/product_manager.py
class ProductManager(IAdminActions):
    def create_product(self, product_data):
        print(f"Creating product with data: {product_data}")

    def update_product(self, product_id, product_data):
        print(f"Updating product {product_id} with data: {product_data}")

    def delete_product(self, product_id):
        print(f"Deleting product {product_id}")

    # Unrelated methods that ProductManager is forced to implement
    def get_order(self, order_id):
        raise NotImplementedError("ProductManager does not handle orders")

    def update_order_status(self, order_id, new_status):
        raise NotImplementedError("ProductManager does not handle orders")

    def create_user(self, user_data):
        raise NotImplementedError("ProductManager does not handle users")

    def delete_user(self, user_id):
        raise NotImplementedError("ProductManager does not handle users")

# Example Usage:
product_manager = ProductManager()
product_manager.create_product({"name": "New Book", "price": 29.99})

# Calling an unrelated method would raise an error
# product_manager.get_order(123)
```

**Comments on the Problematic Code:**
*   The `IAdminActions` interface is a "fat" interface, containing methods for multiple, unrelated responsibilities.
*   `ProductManager` is forced to implement methods for order and user management, even though it has no need for them. This leads to boilerplate code and `NotImplementedError` exceptions.
*   This violates ISP because the `ProductManager` client is forced to depend on methods it does not use.

### "After" Scenario (Improved Code - Python)

To adhere to ISP, we can break down the fat `IAdminActions` interface into smaller, more cohesive interfaces, each focused on a single responsibility.

```python
# interfaces/product_actions.py
from abc import ABC, abstractmethod

class IProductActions(ABC):
    @abstractmethod
    def create_product(self, product_data):
        pass

    @abstractmethod
    def update_product(self, product_id, product_data):
        pass

    @abstractmethod
    def delete_product(self, product_id):
        pass

# interfaces/order_actions.py
class IOrderActions(ABC):
    @abstractmethod
    def get_order(self, order_id):
        pass

    @abstractmethod
    def update_order_status(self, order_id, new_status):
        pass

# interfaces/user_actions.py
class IUserActions(ABC):
    @abstractmethod
    def create_user(self, user_data):
        pass

    @abstractmethod
    def delete_user(self, user_id):
        pass

# services/product_manager.py (After ISP)
from interfaces.product_actions import IProductActions

class ProductManager(IProductActions):
    def create_product(self, product_data):
        print(f"Creating product with data: {product_data}")

    def update_product(self, product_id, product_data):
        print(f"Updating product {product_id} with data: {product_data}")

    def delete_product(self, product_id):
        print(f"Deleting product {product_id}")

# services/order_manager.py
from interfaces.order_actions import IOrderActions

class OrderManager(IOrderActions):
    def get_order(self, order_id):
        print(f"Getting order {order_id}")

    def update_order_status(self, order_id, new_status):
        print(f"Updating order {order_id} to status {new_status}")

# Example Usage:
product_manager = ProductManager()
product_manager.create_product({"name": "Another Book", "price": 39.99})

order_manager = OrderManager()
order_manager.update_order_status(456, "shipped")
```

**Comments on the Improved Code:**
*   The large `IAdminActions` interface has been segregated into three smaller, more specific interfaces: `IProductActions`, `IOrderActions`, and `IUserActions`.
*   `ProductManager` now only implements `IProductActions`, which is directly relevant to its responsibility. It is no longer forced to implement unrelated methods.
*   This approach leads to a more decoupled and maintainable system. Clients can depend on smaller, more focused interfaces.

### Exercise: Apply ISP to a Reporting Module (Python)

**Task:** An e-commerce system has a reporting module that can generate various types of reports (e.g., sales reports, inventory reports, customer reports). The current `IReportGenerator` interface is a fat interface that includes methods for all report types. Your task is to refactor this to adhere to ISP.

**Instructions:**
1.  Identify the different types of reports and their specific data requirements.
2.  Segregate the `IReportGenerator` interface into smaller, more specific interfaces (e.g., `ISalesReportGenerator`, `IInventoryReportGenerator`, `ICustomerReportGenerator`).
3.  Create concrete report generator classes that implement only the interfaces relevant to them.

**Problematic Code (Python - `services/reporting_service.py`):

```python
# services/reporting_service.py (Problematic - Before ISP)
from abc import ABC, abstractmethod

class IReportGenerator(ABC):
    @abstractmethod
    def generate_sales_report(self, start_date, end_date):
        pass

    @abstractmethod
    def generate_inventory_report(self, category=None):
        pass

    @abstractmethod
    def generate_customer_activity_report(self, customer_id):
        pass

class SalesReportGenerator(IReportGenerator):
    def generate_sales_report(self, start_date, end_date):
        print(f"Generating sales report from {start_date} to {end_date}")
        return {"sales": 10000, "orders": 50}

    def generate_inventory_report(self, category=None):
        raise NotImplementedError("This generator only handles sales reports")

    def generate_customer_activity_report(self, customer_id):
        raise NotImplementedError("This generator only handles sales reports")

class InventoryReportGenerator(IReportGenerator):
    def generate_sales_report(self, start_date, end_date):
        raise NotImplementedError("This generator only handles inventory reports")

    def generate_inventory_report(self, category=None):
        print(f"Generating inventory report for category: {category or 'All'}")
        return {"total_items": 5000, "out_of_stock": 100}

    def generate_customer_activity_report(self, customer_id):
        raise NotImplementedError("This generator only handles inventory reports")

# Example Usage:
sales_reporter = SalesReportGenerator()
sales_reporter.generate_sales_report("2023-01-01", "2023-01-31")

inventory_reporter = InventoryReportGenerator()
inventory_reporter.generate_inventory_report("electronics")
```

**Expected Outcome:**

Your refactored code should:
*   Have separate, small interfaces for each type of report generation.
*   Concrete report generator classes should only implement the interfaces that are relevant to their specific report type.
*   The code should be more modular and avoid `NotImplementedError` exceptions for unused methods.

### 3. Node.js/Next.js ISP Exercises: Data Fetching Hooks

### Scenario: Overly Broad Data Fetching Hook

In a Next.js application, it's common to use custom hooks for data fetching. A common ISP violation is to create a single, large data fetching hook that returns a lot of state and methods that might not be needed by all components that use it. This forces components to depend on state and methods they don't use.

### "Before" Scenario (Problematic Code - Node.js/Next.js)

Consider a `useApiData` hook that fetches data and provides state for data, loading status, error, and also methods for refetching, creating, updating, and deleting data.

```javascript
// hooks/useApiData.js (Problematic - Before ISP)

import { useState, useEffect, useCallback } from 'react';

function useApiData(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createItem = useCallback(async (itemData) => {
    // Logic to create an item
    console.log(`Creating item at ${endpoint}:`, itemData);
  }, [endpoint]);

  const updateItem = useCallback(async (itemId, itemData) => {
    // Logic to update an item
    console.log(`Updating item ${itemId} at ${endpoint}:`, itemData);
  }, [endpoint]);

  const deleteItem = useCallback(async (itemId) => {
    // Logic to delete an item
    console.log(`Deleting item ${itemId} at ${endpoint}`);
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData, createItem, updateItem, deleteItem };
}

// components/ProductList.js (A component that only needs to read data)
import React from 'react';
// import useApiData from '../hooks/useApiData'; // Assume this is imported

function ProductList() {
  const { data: products, loading, error } = useApiData('products');
  // This component gets createItem, updateItem, deleteItem, but doesn't use them.

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products && products.map(product => <li key={product.id}>{product.name}</li>)}
      </ul>
    </div>
  );
}

// components/ProductEditor.js (A component that needs to create and update data)
import React from 'react';
// import useApiData from '../hooks/useApiData'; // Assume this is imported

function ProductEditor() {
  const { createItem, updateItem } = useApiData('products');
  // This component gets data, loading, error, deleteItem, but might not use them.

  const handleCreate = () => {
    createItem({ name: 'New Product', price: 10 });
  };

  const handleUpdate = () => {
    updateItem('123', { price: 15 });
  };

  return (
    <div>
      <button onClick={handleCreate}>Create Product</button>
      <button onClick={handleUpdate}>Update Product</button>
    </div>
  );
}
```

**Comments on the Problematic Code:**
*   The `useApiData` hook is a "fat" hook, returning a large object with state and methods for all possible data operations (read, create, update, delete).
*   `ProductList`, which only needs to display data, is forced to receive `createItem`, `updateItem`, and `deleteItem` methods that it doesn't use.
*   `ProductEditor`, which only needs to create and update, receives `data`, `loading`, `error`, and `deleteItem` that it might not use.
*   This violates ISP by forcing components to depend on an interface (the hook's return object) that is larger than they need.

### "After" Scenario (Improved Code - Node.js/Next.js)

To adhere to ISP, we can segregate the fat hook into smaller, more focused hooks. We can have a base hook for fetching data and separate hooks for mutation operations (create, update, delete).

```javascript
// hooks/useQuery.js (For fetching data)
import { useState, useEffect, useCallback } from 'react';

export function useQuery(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// hooks/useMutation.js (For creating, updating, deleting data)
import { useCallback } from 'react';

export function useMutation(endpoint) {
  const createItem = useCallback(async (itemData) => {
    console.log(`Creating item at ${endpoint}:`, itemData);
    // ... fetch logic with POST
  }, [endpoint]);

  const updateItem = useCallback(async (itemId, itemData) => {
    console.log(`Updating item ${itemId} at ${endpoint}:`, itemData);
    // ... fetch logic with PUT/PATCH
  }, [endpoint]);

  const deleteItem = useCallback(async (itemId) => {
    console.log(`Deleting item ${itemId} at ${endpoint}`);
    // ... fetch logic with DELETE
  }, [endpoint]);

  return { createItem, updateItem, deleteItem };
}

// components/ProductList.js (After ISP)
import React from 'react';
import { useQuery } from '../hooks/useQuery';

function ProductList() {
  const { data: products, loading, error } = useQuery('products');
  // This component now only depends on the data fetching interface it needs.

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products && products.map(product => <li key={product.id}>{product.name}</li>)}
      </ul>
    </div>
  );
}

// components/ProductEditor.js (After ISP)
import React from 'react';
import { useMutation } from '../hooks/useMutation';

function ProductEditor() {
  const { createItem, updateItem } = useMutation('products');
  // This component now only depends on the mutation methods it needs.

  const handleCreate = () => {
    createItem({ name: 'New Product', price: 10 });
  };

  const handleUpdate = () => {
    updateItem('123', { price: 15 });
  };

  return (
    <div>
      <button onClick={handleCreate}>Create Product</button>
      <button onClick={handleUpdate}>Update Product</button>
    </div>
  );
}
```

**Comments on the Improved Code:**
*   The `useApiData` hook has been segregated into `useQuery` (for reading data) and `useMutation` (for writing data).
*   `ProductList` now uses `useQuery` and only receives the state and methods it needs (`data`, `loading`, `error`).
*   `ProductEditor` now uses `useMutation` and only receives the methods it needs (`createItem`, `updateItem`).
*   This adheres to ISP by ensuring that components only depend on the interfaces (hooks) that are relevant to their functionality, leading to a more decoupled and maintainable codebase.

## References

[1] Interface segregation principle. Wikipedia. URL: https://en.wikipedia.org/wiki/Interface_segregation_principle




### Dependency Inversion Principle (DIP)

**Core Concept:** The Dependency Inversion Principle states that [1]:
1.  High-level modules should not depend on low-level modules. Both should depend on abstractions.
2.  Abstractions should not depend on details. Details should depend on abstractions.

In essence, DIP promotes designing systems where dependencies are on abstractions (interfaces or abstract classes) rather than on concrete implementations. This inverts the traditional dependency flow, making the system more flexible, testable, and maintainable.

**Importance in E-commerce:** DIP is critical in e-commerce for:
*   **Flexibility and Swappability:** Easily changing underlying implementations (e.g., switching database systems, payment gateways, logging frameworks) without altering high-level business logic.
*   **Testability:** Facilitating unit testing by allowing easy mocking or stubbing of dependencies.
*   **Maintainability:** Reducing the impact of changes in low-level modules on high-level business rules.
*   **Scalability:** Enabling the system to grow and adapt to new technologies or requirements more gracefully.

### 2. Python DIP Exercises: Database Integration

### Scenario: Hardcoded Database Dependency

In many applications, high-level business logic modules directly depend on concrete, low-level database implementations (e.g., a `ProductService` directly instantiating a `MySQLDatabase` client). This violates DIP because the high-level module is coupled to a specific detail (the database type), making it difficult to switch databases or test the `ProductService` without a real database connection.

### "Before" Scenario (Problematic Code - Python)

Consider a `ProductService` that directly creates and uses a `MySQLDatabase` instance.

```python
# database/mysql_database.py

class MySQLDatabase:
    def connect(self):
        print("Connecting to MySQL database...")

    def fetch_products(self):
        print("Fetching products from MySQL...")
        return [{"id": 1, "name": "Laptop (MySQL)", "price": 1200}]

    def save_product(self, product_data):
        print(f"Saving product {product_data["name"]} to MySQL...")

# services/product_service.py (Problematic - Before DIP)

from database.mysql_database import MySQLDatabase

class ProductService:
    def __init__(self):
        self.db = MySQLDatabase() # Direct dependency on concrete implementation
        self.db.connect()

    def get_all_products(self):
        return self.db.fetch_products()

    def add_new_product(self, product_data):
        self.db.save_product(product_data)

# Example Usage:
product_service = ProductService()
products = product_service.get_all_products()
print(products)
product_service.add_new_product({"name": "Keyboard", "price": 75})
```

**Comments on the Problematic Code:**
*   `ProductService` directly depends on `MySQLDatabase`, a low-level detail.
*   If you wanted to switch to PostgreSQL or a NoSQL database, you would have to modify `ProductService`.
*   Testing `ProductService` requires a running MySQL instance, making unit testing difficult.

### "After" Scenario (Improved Code - Python)

To adhere to DIP, we introduce an abstraction (an interface or abstract base class) for the database. The `ProductService` will depend on this abstraction, and the concrete database implementation will be injected into the `ProductService`.

```python
# interfaces/database_interface.py
from abc import ABC, abstractmethod

class IDatabase(ABC):
    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def fetch_products(self):
        pass

    @abstractmethod
    def save_product(self, product_data):
        pass

# database/mysql_database.py (Now implements IDatabase)
class MySQLDatabase(IDatabase):
    def connect(self):
        print("Connecting to MySQL database...")

    def fetch_products(self):
        print("Fetching products from MySQL...")
        return [{"id": 1, "name": "Laptop (MySQL)", "price": 1200}]

    def save_product(self, product_data):
        print(f"Saving product {product_data["name"]} to MySQL...")

# database/postgresql_database.py (New concrete implementation)
class PostgreSQLDatabase(IDatabase):
    def connect(self):
        print("Connecting to PostgreSQL database...")

    def fetch_products(self):
        print("Fetching products from PostgreSQL...")
        return [{"id": 2, "name": "Monitor (PostgreSQL)", "price": 300}]

    def save_product(self, product_data):
        print(f"Saving product {product_data["name"]} to PostgreSQL...")

# services/product_service.py (After DIP - depends on abstraction)
from interfaces.database_interface import IDatabase

class ProductService:
    def __init__(self, db: IDatabase):
        self.db = db # Dependency injected
        self.db.connect()

    def get_all_products(self):
        return self.db.fetch_products()

    def add_new_product(self, product_data):
        self.db.save_product(product_data)

# main.py (or application entry point - where dependencies are wired)
from services.product_service import ProductService
from database.mysql_database import MySQLDatabase
from database.postgresql_database import PostgreSQLDatabase

# Using MySQL
mysql_db = MySQLDatabase()
mysql_product_service = ProductService(mysql_db)
print("--- Using MySQL Product Service ---")
print(mysql_product_service.get_all_products())
mysql_product_service.add_new_product({"name": "Mouse", "price": 25})

print("\n--- Switching to PostgreSQL Product Service ---")
# Using PostgreSQL - no changes needed in ProductService
postgresql_db = PostgreSQLDatabase()
postgresql_product_service = ProductService(postgresql_db)
print(postgresql_product_service.get_all_products())
postgresql_product_service.add_new_product({"name": "Webcam", "price": 50})
```

**Comments on the Improved Code:**
*   `IDatabase` is an abstraction that defines the contract for any database implementation.
*   `MySQLDatabase` and `PostgreSQLDatabase` are low-level modules that implement the `IDatabase` abstraction.
*   `ProductService` (the high-level module) now depends on `IDatabase` (the abstraction), not on `MySQLDatabase` (the detail).
*   The concrete database instance is injected into `ProductService` via its constructor. This is a form of Dependency Injection.
*   This makes `ProductService` independent of the specific database technology, allowing for easy swapping of database implementations and simplified testing (e.g., by injecting a mock database).

### Exercise: Apply DIP to Logging System (Python)

**Task:** An e-commerce application uses a logging system. Currently, various parts of the application directly instantiate and use a concrete `FileLogger`. Your task is to refactor this to adhere to the DIP, allowing for easy switching between different logging mechanisms (e.g., file logging, console logging, database logging) without modifying the client code.

**Instructions:**
1.  Define an abstract base class `ILogger` with a method like `log_message`.
2.  Create concrete implementations for `FileLogger` and `ConsoleLogger` that implement `ILogger`.
3.  Modify a client class (e.g., `OrderProcessor`) to depend on the `ILogger` abstraction, and inject the concrete logger implementation.

**Problematic Code (Python - `services/order_processor.py`):

```python
# loggers/file_logger.py

class FileLogger:
    def __init__(self, filename="app.log"):
        self.filename = filename
        with open(self.filename, "a") as f:
            f.write("Logger initialized.\n")

    def log_message(self, message):
        with open(self.filename, "a") as f:
            f.write(f"[FILE] {message}\n")

# services/order_processor.py (Problematic - Before DIP)

from loggers.file_logger import FileLogger

class OrderProcessor:
    def __init__(self):
        self.logger = FileLogger() # Direct dependency on concrete logger

    def process_order(self, order_id, amount):
        self.logger.log_message(f"Processing order {order_id} for amount ${amount}")
        # Simulate order processing logic
        if amount > 1000:
            self.logger.log_message(f"Order {order_id} is a large order.")
        self.logger.log_message(f"Order {order_id} processed successfully.")
        return {"status": "completed", "order_id": order_id}

# Example Usage:
order_processor = OrderProcessor()
order_processor.process_order(101, 500)
order_processor.process_order(102, 1500)
```

**Expected Outcome:**

Your refactored code should:
*   Have an `ILogger` abstract base class.
*   `FileLogger` and `ConsoleLogger` should implement `ILogger`.
*   `OrderProcessor` should accept an `ILogger` instance in its constructor, making it independent of the specific logging implementation.

### 3. Node.js/Next.js DIP Exercises: External API Integration

### Scenario: Direct Third-Party API Dependency

An e-commerce application might integrate with external services like a shipping carrier API or a marketing automation API. A common DIP violation occurs when a high-level module (e.g., `OrderService`) directly instantiates and uses a concrete client for a third-party API (e.g., `FedExApiClient`). This couples the `OrderService` to a specific shipping carrier, making it hard to switch carriers or test the service without making actual API calls.

### "Before" Scenario (Problematic Code - Node.js/Next.js)

Consider an `OrderService` that directly uses a `ShippingApiClient` for FedEx.

```javascript
// api_clients/fedex_api_client.js

class FedExApiClient {
  constructor() {
    console.log("Initializing FedEx API Client...");
    // In a real app, this would involve API key setup, etc.
  }

  async createShippingLabel(orderInfo) {
    console.log(`Creating FedEx shipping label for order: ${orderInfo.orderId}`);
    // Simulate API call
    return { trackingId: `FEDEX_${Date.now()}`, labelUrl: `http://fedex.com/label/${orderInfo.orderId}` };
  }

  async trackShipment(trackingId) {
    console.log(`Tracking FedEx shipment: ${trackingId}`);
    // Simulate API call
    return { status: "Shipped", estimatedDelivery: "2025-07-25" };
  }
}

// services/orderService.js (Problematic - Before DIP)

import { FedExApiClient } from "../api_clients/fedex_api_client";

class OrderService {
  constructor() {
    this.shippingClient = new FedExApiClient(); // Direct dependency
  }

  async fulfillOrder(orderId, shippingAddress) {
    console.log(`Fulfilling order ${orderId}...`);
    const orderInfo = { orderId, shippingAddress };
    const label = await this.shippingClient.createShippingLabel(orderInfo);
    console.log(`Shipping label created: ${label.labelUrl}`);
    // Update order status in DB, send notification, etc.
    return { status: "fulfilled", trackingId: label.trackingId };
  }

  async getShipmentStatus(orderId, trackingId) {
    console.log(`Getting shipment status for order ${orderId}...`);
    const status = await this.shippingClient.trackShipment(trackingId);
    return status;
  }
}

// Example Usage:
const orderService = new OrderService();

async function runExample() {
  const fulfillmentResult = await orderService.fulfillOrder("ORDER_001", "123 Main St");
  console.log(fulfillmentResult);
  const shipmentStatus = await orderService.getShipmentStatus("ORDER_001", fulfillmentResult.trackingId);
  console.log(shipmentStatus);
}

runExample();
```

**Comments on the Problematic Code:**
*   `OrderService` directly depends on `FedExApiClient`, a concrete implementation of a shipping API.
*   If the business decides to switch to UPS or DHL, `OrderService` would need to be modified.
*   Testing `OrderService` requires actual calls to the FedEx API, which is slow, costly, and unreliable for unit tests.

### "After" Scenario (Improved Code - Node.js/Next.js)

To adhere to DIP, we introduce an abstraction (an interface or abstract class) for the shipping API. The `OrderService` will depend on this abstraction, and the concrete shipping API client will be injected.

```javascript
// interfaces/shipping_api_interface.js

class IShippingApi {
  async createShippingLabel(orderInfo) {
    throw new Error("Method 'createShippingLabel' must be implemented.");
  }

  async trackShipment(trackingId) {
    throw new Error("Method 'trackShipment' must be implemented.");
  }
}

// api_clients/fedex_api_client.js (Now implements IShippingApi)

class FedExApiClient extends IShippingApi {
  constructor() {
    super();
    console.log("Initializing FedEx API Client...");
  }

  async createShippingLabel(orderInfo) {
    console.log(`Creating FedEx shipping label for order: ${orderInfo.orderId}`);
    return { trackingId: `FEDEX_${Date.now()}`, labelUrl: `http://fedex.com/label/${orderInfo.orderId}` };
  }

  async trackShipment(trackingId) {
    console.log(`Tracking FedEx shipment: ${trackingId}`);
    return { status: "Shipped", estimatedDelivery: "2025-07-25" };
  }
}

// api_clients/ups_api_client.js (New concrete implementation)

class UPSApiClient extends IShippingApi {
  constructor() {
    super();
    console.log("Initializing UPS API Client...");
  }

  async createShippingLabel(orderInfo) {
    console.log(`Creating UPS shipping label for order: ${orderInfo.orderId}`);
    return { trackingId: `UPS_${Date.now()}`, labelUrl: `http://ups.com/label/${orderInfo.orderId}` };
  }

  async trackShipment(trackingId) {
    console.log(`Tracking UPS shipment: ${trackingId}`);
    return { status: "In Transit", estimatedDelivery: "2025-07-26" };
  }
}

// services/orderService.js (After DIP - depends on abstraction)

class OrderService {
  constructor(shippingClient) {
    this.shippingClient = shippingClient; // Dependency injected
  }

  async fulfillOrder(orderId, shippingAddress) {
    console.log(`Fulfilling order ${orderId}...`);
    const orderInfo = { orderId, shippingAddress };
    const label = await this.shippingClient.createShippingLabel(orderInfo);
    console.log(`Shipping label created: ${label.labelUrl}`);
    return { status: "fulfilled", trackingId: label.trackingId };
  }

  async getShipmentStatus(orderId, trackingId) {
    console.log(`Getting shipment status for order ${orderId}...`);
    const status = await this.shippingClient.trackShipment(trackingId);
    return status;
  }
}

// main.js (or application entry point - where dependencies are wired)
import { OrderService } from "./services/orderService";
import { FedExApiClient } from "./api_clients/fedex_api_client";
import { UPSApiClient } from "./api_clients/ups_api_client";

async function runExamples() {
  console.log("--- Using FedEx Shipping ---");
  const fedExClient = new FedExApiClient();
  const fedExOrderService = new OrderService(fedExClient);
  const fedExResult = await fedExOrderService.fulfillOrder("ORDER_FEDEX_001", "456 Oak Ave");
  console.log(fedExResult);
  console.log(await fedExOrderService.getShipmentStatus("ORDER_FEDEX_001", fedExResult.trackingId));

  console.log("\n--- Switching to UPS Shipping ---");
  const upsClient = new UPSApiClient();
  const upsOrderService = new OrderService(upsClient);
  const upsResult = await upsOrderService.fulfillOrder("ORDER_UPS_001", "789 Pine Ln");
  console.log(upsResult);
  console.log(await upsOrderService.getShipmentStatus("ORDER_UPS_001", upsResult.trackingId));
}

runExamples();
```

**Comments on the Improved Code:**
*   `IShippingApi` is an abstraction (interface) that defines the contract for any shipping API client.
*   `FedExApiClient` and `UPSApiClient` are low-level modules that implement `IShippingApi`.
*   `OrderService` (the high-level module) now depends on `IShippingApi` (the abstraction), not on `FedExApiClient` or `UPSApiClient` (the details).
*   The concrete shipping client is injected into `OrderService` via its constructor.
*   This makes `OrderService` independent of the specific shipping carrier, allowing for easy swapping of providers and simplified testing (e.g., by injecting a mock shipping client).

## References

[1] Dependency inversion principle. Wikipedia. URL: https://en.wikipedia.org/wiki/Dependency_inversion_principle




# Programming Principles Exercises: DRY, KISS, and SOLID for E-commerce Web Applications

## Introduction

This document provides a comprehensive set of programming exercises focused on the fundamental principles of software design: DRY (Don't Repeat Yourself), KISS (Keep It Simple, Stupid), and SOLID (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion). These principles are crucial for developing robust, maintainable, and scalable software, especially in complex domains like e-commerce.

Each exercise is designed to illustrate a specific principle within the context of an e-commerce web application. We will explore common scenarios where these principles are often violated and then demonstrate how to refactor code to adhere to them. The exercises are provided in both Python (for backend/API logic) and Node.js/Next.js (for frontend and backend API routes), offering a practical, language-agnostic understanding of the concepts.

## How to Use These Exercises

For each principle, you will find:
1.  **Principle Introduction:** A brief explanation of the principle and its importance in e-commerce.
2.  **"Before" Scenario (Problem):** A description of a problematic e-commerce scenario with code examples (Python and Node.js/Next.js) that violate the principle. Comments will highlight the specific issues.
3.  **"After" Scenario (Solution):** The refactored code examples demonstrating how to apply the principle, along with explanations of the improvements.
4.  **Exercise: Apply the Principle:** A new, related task for you to solve independently, using the learned principles. This section includes instructions, problematic starter code, and the expected outcome.

We encourage you to:
*   **Read and Understand:** Carefully read the introduction and the "Before" and "After" scenarios for each principle.
*   **Analyze the Code:** Pay close attention to the code examples, understanding why the "Before" code is problematic and how the "After" code improves upon it.
*   **Attempt the Exercises:** Try to solve the "Exercise" section on your own before looking for external solutions. This hands-on practice is key to internalizing the principles.
*   **Experiment:** Feel free to modify the provided code, break it, and fix it to deepen your understanding.

By working through these exercises, you will gain practical experience in applying DRY, KISS, and SOLID principles, leading to cleaner, more efficient, and more maintainable e-commerce applications.

---



