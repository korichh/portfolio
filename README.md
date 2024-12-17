# devops-portfolio

In this project, I'll walk you through how I deployed my [Full Stack Portfolio Website](https://korichh.com), the tools and technologies I used, and the architecture I implemented to make it all work seamlessly.

## Project Overview

I had a vision to create a portfolio website that was easy to manage, cost-effective, and fun to build. Instead of relying on existing platforms, I decided to take on the challenge of building my own CMS from scratch, deploying it to a VPS, and setting up everything myself using modern DevOps practices.

Here’s a breakdown of my approach:

- **CMS** - i built my own CMS using NodeJS and MySQL to enhance my skills in building NodeJS apps and ensure I had full control over the content and flexibility in managing SEO.
- **Containerization** - i utilized Docker to split the application environments (NodeJS and MySQL) into separate containers, keeping the stack modular and manageable.
- **Nginx Proxy** -to route traffic efficiently and serve static content, I configured Nginx as a reverse proxy, directing traffic between the containers.
- **Cloudflare Protection** - for security and performance, I used Cloudflare to handle DNS, improve security and provide free SSL for HTTPS.
- **VPS Hosting** - finally, I hosted everything on a VPS from Hostinger, which gives me full control over the server environment.

### The Final Architecture

The architecture is as follows:

1. **NodeJS CMS** for content management.
2. **MySQL** for database management, running in a separate container.
3. **Nginx** as the reverse proxy, routing traffic to the NodeJS app.
4. **Cloudflare** for DNS management, security, and caching.
5. **VPS** as the hosting provider for full root access to configure everything.

![](https://github.com/korichh/devops-portfolio/blob/main/images/1.png?raw=true)

## Custom CMS with NodeJS

I wanted to create a content management system (CMS) that was lightweight yet flexible. Using NodeJS, I built a CMS that allows me to manage pages, entities, their classifications and SEO settings for my portfolio. By doing this, I not only gained deeper insight into building full-stack apps but also ensured that my website is easily manageable without external dependencies.

You can explore the CMS in detail on GitHub: [NodeJS CMS](https://github.com/korichh/nodejs-cms).

## Docker Containers

Containerizing the NodeJS and MySQL environments was a key part of keeping the system modular. By using Docker Compose plugin, I could orchestrate multiple containers with a single YAML configuration. This simplified deployment, making it easy to spin up or tear down environments with a few commands.

Here are examples of the core files:
- [Dockerfile](https://github.com/korichh/devops-portfolio/blob/main/Dockerfile)
- [docker-compose.yml](https://github.com/korichh/devops-portfolio/blob/main/docker-compose.yml)

## Nginx Reverse Proxy

To efficiently manage incoming traffic, I configured **Nginx** as a reverse proxy. This setup allows Nginx to serve static files directly, because it is the most efficient server for serving static resources now, and forward dynamic requests to the NodeJS backend.

Here’s the [Nginx configuration file](https://github.com/korichh/devops-portfolio/blob/main/.conf), which is usually put to the `/etc/nginx/sites-available/` directory and enabled by creating a symbolic link to `/sites-enabled/`. Be sure to properly test it `sudo nginx -t` before reloading the server.

## Cloudflare

I used **Cloudflare** for managing DNS and securing the website. Cloudflare offers a lot of protection against malicious attacks, provides a free SSL certificate to ensure that my website is secure via HTTPS and provides caching options and allows me to configure redirects, such as routing traffic from `www` to the root domain.

## VPS Hosting

For hosting, I chose a **VPS** (Virtual Private Server) from Hostinger, which offers full root access at an affordable price. The VPS has 4GB RAM and 1 virtual CPU core, which is more than enough for my current needs.

The total cost for hosting this setup is around $7/month including domain name rent, which makes it a very cost-efficient solution.

---

That’s the overview of how I built and deployed my portfolio website! You can check out the live version at [korichh.com](https://korichh.com), and I hope this inspires you to try something similar for your own projects.
