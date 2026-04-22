import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // 用户状态
      user: null,
      loading: false,
      error: null,
      
      // 全局数据
      branches: [],
      selectedBranch: null,
      
      // 设置用户
      setUser: (user) => set({ user }),
      
      // 清除用户
      clearUser: () => set({ user: null }),
      
      // 设置加载状态
      setLoading: (loading) => set({ loading }),
      
      // 设置错误信息
      setError: (error) => set({ error }),
      
      // 清除错误信息
      clearError: () => set({ error: null }),
      
      // 设置分店列表
      setBranches: (branches) => set({ branches }),
      
      // 设置选中的分店
      setSelectedBranch: (branchId) => set({ selectedBranch: branchId }),
      
      // 重置所有状态
      reset: () => set({
        user: null,
        loading: false,
        error: null,
        branches: [],
        selectedBranch: null
      })
    }),
    {
      name: 'dragongateinn-storage',
      partialize: (state) => ({
        user: state.user,
        branches: state.branches
      })
    }
  )
);

export default useStore;