from flask import Blueprint, render_template

dashboard = Blueprint('dashboard', __name__, url_prefix='/dashboard')

@dashboard.route('/')
def dashboard_home():
    return render_template('dashboard/index.html', title='Operative Dashboard · CyberKidzSec Vault')
