/**
 *
 *  build docker tạo imagedoc
 * docker build -t image-be_cyber_media .
 *
 * CONTAINER -----------------------------------------------\\
 *  docker run -d -p 3070:3069 --name cons-be_cyber_media image-be_cyber_media
 *
 * Container list:
 *  docker container ls
 *  docker ps => các lập trình viên hay dùng
 *  --- lấy ra các container ĐANG OL
 *
 *
 * docker ps -a
 * -- lấy ra tất cả các container cà OL và OFF
 *
 *
 * Container restart:
 *   docker container restart id_name_container
 *
 *
 * TERMINAL:
 *  docker logs id_ten_container
 *
 * Tìm địa chỉ ip của 1 container bên trong 1 docker
 *  docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' id_name_DB_SQL_container
 *
 * Docker compose
 *
 *   docker compose up -d
 *   -d không chiếm dụng terminal
 *
 *
 *
 */
