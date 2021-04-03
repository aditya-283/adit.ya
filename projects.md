---
layout: page
title: Projects
description: Things I've built and associated source code.
body-class: projects
# redirect_from:
#   - /projects/
---

# Projects

<div class="tout tout--secondary">
<p> Code that demonstrates interesting ideas from machine learning or computer science </p> 
<!-- or mini applications -->
</div> 

<br>

{% assign sorted_projects = site.projects | sort: 'position' %}

<!-- start block -->
<div id="projectbox"> 
{% for project in sorted_projects %}

<!-- start product -->       
<div class="project">
  <div class="project_img">
    <img src="{{site.url}}/img/projects/{{project.image}}" class="wh-auto">
  </div>
  <div class="project_content"> 
    <h2 id="{{ project.title | slugify }}" class="project_title"><a href="{{ project.view_url }}">{{ project.title }}</a></h2>
    <div class="clear"></div>
    <div class="project_overview">{{ project.content }} </div>
    <div class="clear"></div>
  </div>
</div>
{% endfor %}
</div>       
<!-- end of block -->