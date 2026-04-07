FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*

# Копируем содержимое папки public в /usr/share/nginx/html/public
# Используем COPY public/. (с точкой), чтобы скопировать файлы ВНУТРЬ папки
COPY public/ /usr/share/nginx/html/public/
COPY src/ /usr/share/nginx/html/src/
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]