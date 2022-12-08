include .env

.PHONY: up

up:
	docker-compose -f docker-compose.dev.yml up -d

.PHONY: down

down:
	docker-compose -f docker-compose.dev.yml down

.PHONY: logs

logs:
	docker-compose logs -f
