const MyDashboard = () => {
  return (
    <div style={{padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <h1 style={{marginBottom: '20px', color: '#333'}}>Test Dashboard</h1>
        <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
          <div style={{flex: '1', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
            <h3 style={{margin: '0 0 10px 0', color: '#666'}}>Revenue</h3>
            <div style={{fontSize: '32px', fontWeight: 'bold', color: '#333'}}>$123,456</div>
            <div style={{fontSize: '14px', color: '#22c55e'}}>+12.5%</div>
          </div>
          <div style={{flex: '1', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
            <h3 style={{margin: '0 0 10px 0', color: '#666'}}>Orders</h3>
            <div style={{fontSize: '32px', fontWeight: 'bold', color: '#333'}}>2,847</div>
            <div style={{fontSize: '14px', color: '#22c55e'}}>+8.2%</div>
          </div>
          <div style={{flex: '1', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
            <h3 style={{margin: '0 0 10px 0', color: '#666'}}>Customers</h3>
            <div style={{fontSize: '32px', fontWeight: 'bold', color: '#333'}}>12,483</div>
            <div style={{fontSize: '14px', color: '#22c55e'}}>+3.1%</div>
          </div>
        </div>
        <div style={{backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginBottom: '20px', color: '#666'}}>Sample Chart</h3>
          <BarChart width={800} height={300} data={[
            { name: 'Jan', value: 4000 },
            { name: 'Feb', value: 3000 },
            { name: 'Mar', value: 2000 },
            { name: 'Apr', value: 2780 },
            { name: 'May', value: 1890 },
            { name: 'Jun', value: 2390 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};
