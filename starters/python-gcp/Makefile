.PHONY: help install seed list test clean

help:
	@echo "Targets:"
	@echo "  install  Install Python dependencies"
	@echo "  seed     Insert local sample data"
	@echo "  list     List local rows"
	@echo "  test     Show CLI help"
	@echo "  clean    Remove local runtime artifacts"

install:
	pip install -r requirements.txt

seed:
	python3 main.py seed

list:
	python3 main.py list

test:
	python3 -m py_compile main.py database.py models.py gcp.py

clean:
	rm -rf __pycache__ .pytest_cache
	rm -f microposts.db *.ndjson
