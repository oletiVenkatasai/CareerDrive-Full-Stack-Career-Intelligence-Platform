import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Briefcase, Lock, Mail, User, Building, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role, companyName: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    if (formData.role === 'RECRUITER' && !formData.companyName) {
      return toast.error('Company Name is required for Recruiters');
    }

    setIsSubmitting(true);
    try {
      const response = await authService.register(formData);
      const { token, user } = response.data;
      
      
      login(token, user);
      toast.success('Registration successful!');

      
      navigate(`/${user.role.toLowerCase()}/dashboard`, { replace: true });
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-bg py-12">
      <div className="glass-card w-full max-w-md p-8 animate-fade-in my-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <Briefcase size={24} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
          <p className="text-slate-400 text-sm">Join CareerDrive today</p>
        </div>

        {}
        <div className="flex gap-4 mb-8 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              formData.role === 'STUDENT'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => handleRoleChange('STUDENT')}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              formData.role === 'RECRUITER'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => handleRoleChange('RECRUITER')}
          >
            Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="Min. 6 characters"
                minLength="6"
                required
              />
            </div>
          </div>

          {formData.role === 'RECRUITER' && (
            <div className="form-group animate-slide-in">
              <label className="form-label">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="form-input"
                style={{ paddingLeft: '40px' }}
                  placeholder="Acme Corp"
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-full py-3 mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><Loader2 size={18} className="animate-spin" /> Creating Account...</>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-700/50 pt-6">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
