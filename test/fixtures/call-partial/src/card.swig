---
name: Default Name
lastname: Default Last Name
partial: true
---
{#
This is a comment.
It will be fully stripped and ignored during parsing.
#}

<div class="card">
  <h2>This is a call-partial card!</h2>
  <h3>Name: {{name}}</h3>
  <h3>Last Name: {{lastname}}</h3>
</div>
