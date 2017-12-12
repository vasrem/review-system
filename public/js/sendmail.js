$(document).ready(function() {
	$('.mailform').submit(function(event) {
		event.preventDefault()
		var data = {
			reviewId: parseInt(event.target.children[1].value)
		}
		console.log("ASdasD")
		$.post('/sendmail', data, (resp) => {
			alert("Email sent for review #" + data.reviewId + "!")
		})
	})
})
