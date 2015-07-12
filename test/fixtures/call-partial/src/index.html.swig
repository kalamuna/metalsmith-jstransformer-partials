---
title: Hello, World!
---
<h1>{{ title }}</h1>

<div class="partial-wrapper">
{{ partial('card', {name:'Updated Name!'})|safe }}
</div>

<div class="author-wrapper">
{{ partial('author', {name:'Rob', lastname:'Loach'})|safe }}
</div>

<div class="partial-wrapper">
{{ partial('card')|safe }}
</div>
