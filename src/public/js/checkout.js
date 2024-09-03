function initRazorpay(orderId, amount) {
    const options = {
      key:  process.env.RAZORPAY_KEY_ID, // Replace with your actual Razorpay Key ID
      amount: amount,
      currency: 'INR',
      name: 'Ashion',
      description: 'Order Payment',
      order_id: orderId,
      handler: function (response) {
        // Handle the response after payment
        fetch('/verify-payment', { // Make sure the path matches your backend route
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Payment Successful!');
            window.location.href = '/thank-you'; // Redirect to a thank you page
          } else {
            alert('Payment Failed.');
          }
        });
      },
      prefill: {
        name: 'Mouna',
        email: 'mounabrcs@gmail.com',
        contact: '99999999990'
      },
      theme: {
        color: '#3399cc'
      }
    };
  
    const rzp = new Razorpay(options);
    rzp.open();
  }
  