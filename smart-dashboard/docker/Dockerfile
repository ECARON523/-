# В Dockerfile (внутри папки docker) напиши так:
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*

# Теперь Docker видит корень, поэтому пишем просто public, а не ../public
COPY public /usr/share/nginx/html/public
COPY src /usr/share/nginx/html/src
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]