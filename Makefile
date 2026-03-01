PROJECT_NAME=wallet_app

DC=docker compose

build:
	$(DC) build

up:
	$(DC) up -d

up-build:
	$(DC) up -d --build

logs:
	$(DC) logs -f

down:
	$(DC) down

down-v:
	$(DC) down -v

restart:
	$(DC) restart

sh:
	$(DC) exec app sh

clean:
	docker system prune -f