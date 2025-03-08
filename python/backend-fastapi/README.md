python3 -m venv myenv
source myenv/bin/activate

pip install fastapi uvicorn
pip3 install -r requirements.txt
pip freeze > requirements.txt

uvicorn main:app --reload

deactivate