# System_gestion_parc_vehicule
delete ip address used by postgressql 5342
sudo systemctl stop postgresql

create superuser to seee interface admin 
docker exec -it backend bash
python manage.py createsuperuser


how to test each time tests files 



docker compose exec backend python manage.py test core.tests.test_models
docker compose exec backend python manage.py test core
docker compose exec backend python manage.py test authentication