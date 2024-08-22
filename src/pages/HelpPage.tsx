const HelpPage = () => {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Help</h1>
      <section className='mb-4'>
        <h2 className='text-xl font-semibold mb-2'>Creating a New Note</h2>
        <p>To create a new note, follow these steps:</p>
        <ol className='list-decimal list-inside'>
          <li>Click on plus icon (+) in the home top bar.</li>
          <li>Enter the title and content of your note.</li>
          <li>Add existing or new tags.</li>
          <li>Note will be auto saved.</li>
        </ol>
      </section>
      <section className='mb-4'>
        <h2 className='text-xl font-semibold mb-2'>Using the Context Menu</h2>
        <p>To create context menu entry, follow these steps:</p>
        <ol className='list-decimal list-inside'>
          <li>Click on plus icon (+) in the home top bar..</li>
          <li>Enter the context menu title.</li>
          <li>Menu can be nested using &gt; sign.</li>
          <li>Add special tag 'context'.</li>
        </ol>
      </section>
    </div>
  )
}

export default HelpPage